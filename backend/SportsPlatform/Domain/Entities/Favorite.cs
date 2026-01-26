namespace SportsPlatform.Domain.Entities;

public class Favorite
{
	public int Id { get; set; }
	public int UserId { get; set; }
	public User? User { get; set; }
	public int CompetitionId { get; set; }
	public Competition? Competition { get; set; }
}