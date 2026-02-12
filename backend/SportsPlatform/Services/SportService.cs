using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;
using SportsPlatform.Dtos; // 👈 Не забудь додати цей рядок!

namespace SportsPlatform.Services;

public class SportService
{
    private readonly AppDbContext _context;

    public SportService(AppDbContext context)
    {
        _context = context;
    }

    // Цей метод для адмінки (повертає просто сутності)
    public async Task<List<Sport>> GetAllAsync()
    {
        return await _context.Sports
            .Include(s => s.Competitions)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    // 👇 НОВИЙ МЕТОД СПЕЦІАЛЬНО ДЛЯ САЙДБАРУ 👇
    public async Task<List<SportSidebarDto>> GetSidebarDataAsync()
    {
        // 1. Тягнемо спорт і змагання
        var sports = await _context.Sports
            .Include(s => s.Competitions)
            .OrderBy(s => s.Id) // Сортуємо по ID (зазвичай футбол перший)
            .ToListAsync();

        // 2. Конвертуємо в DTO і рахуємо матчі
        var result = sports.Select(s => new SportSidebarDto
        {
            Id = s.Id,
            Name = s.Name,
            Competitions = s.Competitions.Select(c => new CompetitionSidebarDto
            {
                Id = c.Id,
                Name = c.Name,
                // Заповнюємо країну
                Country = c.Country ?? "Світ",
                // Рахуємо кількість матчів у цій лізі
                Count = _context.Matches.Count(m => m.CompetitionId == c.Id)
            }).ToList()
        }).ToList();

        return result;
    }

    public async Task<Sport> CreateAsync(string name)
    {
        var sport = new Sport { Name = name };
        _context.Sports.Add(sport);
        await _context.SaveChangesAsync();
        return sport;
    }

    public async Task UpdateAsync(int id, string newName)
    {
        var sport = await _context.Sports.FindAsync(id);
        if (sport == null) throw new Exception("Спорт не знайдено");

        sport.Name = newName;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var sport = await _context.Sports.FindAsync(id);
        if (sport == null) throw new Exception("Спорт не знайдено");

        _context.Sports.Remove(sport);
        await _context.SaveChangesAsync();
    }
}