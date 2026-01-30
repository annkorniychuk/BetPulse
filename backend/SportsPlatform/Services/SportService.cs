using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Services;

public class SportService
{
    private readonly AppDbContext _context; 

    public SportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Sport>> GetAllAsync()
    {
        return await _context.Sports.ToListAsync();
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