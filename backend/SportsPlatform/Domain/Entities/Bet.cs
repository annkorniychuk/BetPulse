namespace SportsPlatform.Domain.Entities;

public class Bet
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public decimal Amount { get; set; }
    public string EventName { get; set; } = string.Empty;
    public decimal Coefficient { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Won, Lost
    public DateTime DatePlaced { get; set; } = DateTime.UtcNow;
}
//історія ставок