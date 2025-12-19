using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Services;

public class CompetitionService
{
    private readonly AppDbContext _db;

    public CompetitionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Competition>> GetAllAsync()
    {
        return await _db.Competitions
            .Include(x => x.Sport)
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<Competition?> GetByIdAsync(int id)
    {
        return await _db.Competitions
            .Include(x => x.Sport)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Competition> CreateAsync(string name, int sportId)
    {
        var sport = await _db.Sports.FindAsync(sportId);
        if (sport == null)
            throw new KeyNotFoundException("Sport not found");

        var competition = new Competition
        {
            Name = name,
            SportId = sportId
        };

        _db.Competitions.Add(competition);
        await _db.SaveChangesAsync();

        return competition;
    }

    public async Task DeleteAsync(int id)
    {
        var competition = await _db.Competitions.FindAsync(id);
        if (competition == null)
            throw new KeyNotFoundException("Competition not found");

        _db.Competitions.Remove(competition);
        await _db.SaveChangesAsync();
    }
}
