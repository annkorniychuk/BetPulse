namespace SportsPlatform.Domain.Entities;

using System.Text.Json.Serialization;

public class Competition
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public int SportId { get; set; }
    // public Sport Sport { get; set; } = null!;
    public string Country { get; set; } = "World";

    [JsonIgnore]
    public Sport? Sport { get; set; } 
}
