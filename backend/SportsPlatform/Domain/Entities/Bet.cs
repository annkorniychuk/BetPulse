namespace SportsPlatform.Domain.Entities;

public class Bet
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    // ЗМІНЕНО: Тепер ставка прив'язана до конкретного матчу
    public int MatchId { get; set; }
    public Match Match { get; set; } = null!;

    // ДОДАНО: Вибір гравця (1, X, або 2)
    public string Choice { get; set; } = null!;

    public decimal Amount { get; set; }
    public decimal Odd { get; set; }
    public decimal PotentialWin { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime BetDate { get; set; } = DateTime.UtcNow;
}