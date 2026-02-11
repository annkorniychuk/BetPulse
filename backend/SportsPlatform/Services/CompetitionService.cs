using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Services;

public class CompetitionService
{
    private readonly AppDbContext _context;

    public CompetitionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Competition>> GetAllAsync(string? searchTerm)
    {
        var query = _context.Competitions
            .Include(c => c.Sport)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(searchTerm) ||
                x.Sport.Name.ToLower().Contains(searchTerm));
        }

        return await query.OrderBy(c => c.Name).ToListAsync();
    }

    public async Task<Competition?> GetByIdAsync(int id)
    {
        return await _context.Competitions
            .Include(c => c.Sport)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Competition> CreateAsync(string name, int sportId)
    {
        var sportExists = await _context.Sports.AnyAsync(s => s.Id == sportId);
        if (!sportExists) throw new Exception("Спорт не знайдено");

        var existingCompetition = await _context.Competitions
            .FirstOrDefaultAsync(c => c.Name == name && c.SportId == sportId);

        if (existingCompetition != null)
        {
            return existingCompetition; 
        }

        string detectedCountry = DetermineCountry(name);

        var competition = new Competition
        {
            Name = name,
            SportId = sportId,
            Country = detectedCountry 
        };

        _context.Competitions.Add(competition);
        await _context.SaveChangesAsync();
        return competition;
    }

    public async Task UpdateAsync(int id, string name, int sportId)
    {
        var competition = await _context.Competitions.FindAsync(id);
        if (competition == null) throw new Exception("Змагання не знайдено");

        var sportExists = await _context.Sports.AnyAsync(s => s.Id == sportId);
        if (!sportExists) throw new Exception("Такого спорту не існує");

        competition.Name = name;
        competition.SportId = sportId;

        competition.Country = DetermineCountry(name);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var competition = await _context.Competitions.FindAsync(id);
        if (competition == null) throw new Exception("Змагання не знайдено");

        _context.Competitions.Remove(competition);
        await _context.SaveChangesAsync();
    }

    private string DetermineCountry(string name)
    {
        var n = name.ToLower();

        if (n.Contains("england") || n.Contains("premier league") || n.Contains("прем'єр") || n.Contains("championship")) return "Англія";

        if (n.Contains("spain") || n.Contains("la liga") || n.Contains("laliga") || n.Contains("segunda") || n.Contains("іспанія")) return "Іспанія";

        if (n.Contains("italy") || n.Contains("serie a") || n.Contains("seria a") || n.Contains("італія")) return "Італія";

        if (n.Contains("germany") || n.Contains("bundesliga") || n.Contains("німеччина")) return "Німеччина";

        if (n.Contains("france") || n.Contains("ligue 1") || n.Contains("франція")) return "Франція";

        if (n.Contains("ukraine") || n.Contains("upl") || n.Contains("упл") || n.Contains("vbet")) return "Україна";

        if (n.Contains("champions") || n.Contains("uefa") || n.Contains("europa")) return "Європа";

        if (n.Contains("nba") || n.Contains("nhl") || n.Contains("usa")) return "США";

        return "Світ";
    }
}