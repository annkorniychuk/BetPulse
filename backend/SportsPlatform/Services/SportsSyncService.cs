using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;
using System.Net.Http.Json;

namespace SportsPlatform.Services;

public class SportsSyncService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly HttpClient _httpClient;

    private const string ApiKey = "6924dcf04786d132d819ba356edba887";

    private readonly List<(string Key, string SportName, string CompetitionName)> _leagues = new()
    {
        ("soccer_epl", "Футбол", "Прем'єр-ліга Англії"),
        ("soccer_uefa_champs_league", "Футбол", "Ліга Чемпіонів"),
        ("basketball_nba", "Баскетбол", "NBA"),
        ("tennis_atp_wimbledon", "Теніс", "Wimbledon")
    };

    public SportsSyncService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _httpClient = new HttpClient();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try { await SyncDataAsync(); }
            catch (Exception ex) { Console.WriteLine($" Sync Error: {ex.Message}"); }

            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }

    private async Task SyncDataAsync()
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            foreach (var league in _leagues)
            {
                var sport = await context.Sports.FirstOrDefaultAsync(s => s.Name == league.SportName);
                if (sport == null)
                {
                    sport = new Sport { Name = league.SportName };
                    context.Sports.Add(sport);
                    await context.SaveChangesAsync(); 
                }

                var competition = await context.Competitions
                    .FirstOrDefaultAsync(c => c.Name == league.CompetitionName && c.SportId == sport.Id);

                if (competition == null)
                {
                    competition = new Competition { Name = league.CompetitionName, SportId = sport.Id };
                    context.Competitions.Add(competition);
                    await context.SaveChangesAsync(); 
                }

                var url = $"https://api.the-odds-api.com/v4/sports/{league.Key}/odds/?apiKey={ApiKey}&regions=eu&markets=h2h";
                var apiMatches = await _httpClient.GetFromJsonAsync<List<ApiMatchDto>>(url);

                if (apiMatches == null) continue;

                foreach (var item in apiMatches)
                {
                    var dbMatch = await context.Matches.FirstOrDefaultAsync(m => m.ExternalId == item.id);

                    var bookmaker = item.bookmakers.FirstOrDefault();
                    var market = bookmaker?.markets.FirstOrDefault(m => m.key == "h2h");

                    double o1 = 1.0, o2 = 1.0, oX = 1.0;
                    if (market != null)
                    {
                        o1 = market.outcomes.FirstOrDefault(o => o.name == item.home_team)?.price ?? 1.0;
                        o2 = market.outcomes.FirstOrDefault(o => o.name == item.away_team)?.price ?? 1.0;
                        oX = market.outcomes.FirstOrDefault(o => o.name == "Draw")?.price ?? 1.0;
                    }

                    if (dbMatch == null)
                    {
                        context.Matches.Add(new Match
                        {
                            ExternalId = item.id,
                            Team1 = item.home_team,
                            Team2 = item.away_team,
                            StartTime = item.commence_time,
                            Odds1 = o1,
                            Odds2 = o2,
                            OddsX = oX,
                            CompetitionId = competition.Id, 
                            IsManual = false
                        });
                    }
                    else if (!dbMatch.IsManual) 
                    {
                        dbMatch.StartTime = item.commence_time;
                        dbMatch.Odds1 = o1;
                        dbMatch.Odds2 = o2;
                        dbMatch.OddsX = oX;
                    }
                }
                await context.SaveChangesAsync();
            }
        }
    }

    // DTO класи для API 
    public class ApiMatchDto
    {
        public string id { get; set; }
        public DateTime commence_time { get; set; }
        public string home_team { get; set; }
        public string away_team { get; set; }
        public List<ApiBookmaker> bookmakers { get; set; }
    }
    public class ApiBookmaker { public List<ApiMarket> markets { get; set; } }
    public class ApiMarket { public string key { get; set; } public List<ApiOutcome> outcomes { get; set; } }
    public class ApiOutcome { public string name { get; set; } public double price { get; set; } }
}