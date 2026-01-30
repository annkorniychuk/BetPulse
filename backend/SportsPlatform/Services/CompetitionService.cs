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

    public async Task<List<Competition>> GetAllAsync(string? searchTerm = null)
    {
        var query = _db.Competitions
            .Include(x => x.Sport)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(searchTerm) ||
                x.Sport.Name.ToLower().Contains(searchTerm)
            );
        }

        return await query.OrderBy(x => x.Name).ToListAsync();
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

    public async Task UpdateAsync(int id, string name, int sportId)
    {
        var competition = await _context.Competitions.FindAsync(id);
        if (competition == null) throw new Exception("Змагання не знайдено");

        var sportExists = await _context.Sports.AnyAsync(s => s.Id == sportId);
        if (!sportExists) throw new Exception("Такого спорту не існує");

        competition.Name = name;
        competition.SportId = sportId;

        await _context.SaveChangesAsync();
    }
}
