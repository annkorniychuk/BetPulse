namespace SportsPlatform.Domain.Entities;

public class Bet
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int CompetitionId { get; set; }
    public Competition Competition { get; set; } = null!; 

    public decimal Amount { get; set; }
    public decimal Odd { get; set; }
    public decimal PotentialWin { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime BetDate { get; set; } = DateTime.UtcNow;
}