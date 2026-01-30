using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;


namespace SportsPlatform.Services;

public class SportService
{
    private readonly AppDbContext _db;

    public SportService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Sport>> GetAllAsync()
    {
        return await _db.Sports
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<Sport?> GetByIdAsync(int id)
    {
        return await _db.Sports.FindAsync(id);
    }

    public async Task<Sport> CreateAsync(string name)
    {
        var exists = await _db.Sports.AnyAsync(x => x.Name == name);
        if (exists)
            throw new InvalidOperationException("Sport already exists");

        var sport = new Sport
        {
            Name = name
        };

        _db.Sports.Add(sport);
        await _db.SaveChangesAsync();

        return sport;
    }

    public async Task DeleteAsync(int id)
    {
        var sport = await _db.Sports.FindAsync(id);
        if (sport == null)
            throw new KeyNotFoundException("Sport not found");

        _db.Sports.Remove(sport);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, string newName)
    {
        var sport = await _context.Sports.FindAsync(id);
        if (sport == null) throw new Exception("Спорт не знайдено");

        sport.Name = newName;
        await _context.SaveChangesAsync();
    }
}
