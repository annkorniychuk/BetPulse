namespace SportsPlatform.Domain.Entities;

public class Competition
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public int SportId { get; set; }
    public Sport Sport { get; set; } = null!;
}
