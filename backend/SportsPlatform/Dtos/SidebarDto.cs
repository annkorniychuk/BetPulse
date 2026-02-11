namespace SportsPlatform.Dtos;

public class SportSidebarDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<CompetitionSidebarDto> Competitions { get; set; } = new();
}

public class CompetitionSidebarDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; } // Кількість матчів (поки можна ставити 0 або реалізувати пізніше)
    public string Country { get; set; } = "Світ";
}