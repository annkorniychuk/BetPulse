namespace SportsPlatform.Domain.Entities;

using System.Text.Json.Serialization;

public class Sport
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    [JsonIgnore]
    public List<Competition> Competitions { get; set; } = new();
}
