namespace SportsPlatform.Domain.Entities;

public class Match
{
    public int Id { get; set; }

    public string? ExternalId { get; set; }

    public string Team1 { get; set; } = string.Empty;
    public string Team2 { get; set; } = string.Empty;

    public DateTime StartTime { get; set; }

    public string Status { get; set; } = "PreMatch";

    public double Odds1 { get; set; }
    public double OddsX { get; set; }
    public double Odds2 { get; set; }

    public int CompetitionId { get; set; }
    public Competition Competition { get; set; } = null!;

    public bool IsManual { get; set; } = false;
}