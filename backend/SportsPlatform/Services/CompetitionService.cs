using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Services;

public class CompetitionService
{
    private readonly AppDbContext _context; 

    public CompetitionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Competition>> GetAllAsync(string? searchTerm)
    {
        var query = _context.Competitions
            .Include(c => c.Sport)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(searchTerm) ||
                x.Sport.Name.ToLower().Contains(searchTerm));
        }

        return await query.OrderBy(c => c.Name).ToListAsync();
    }

    public async Task<Competition?> GetByIdAsync(int id)
    {
        return await _context.Competitions
            .Include(c => c.Sport)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Competition> CreateAsync(string name, int sportId)
    {
        var sportExists = await _context.Sports.AnyAsync(s => s.Id == sportId);
        if (!sportExists) throw new Exception("Спорт не знайдено");

        var competition = new Competition
        {
            Name = name,
            SportId = sportId
        };

        _context.Competitions.Add(competition);
        await _context.SaveChangesAsync();
        return competition;
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

    public async Task DeleteAsync(int id)
    {
        var competition = await _context.Competitions.FindAsync(id);
        if (competition == null) throw new Exception("Змагання не знайдено");

        _context.Competitions.Remove(competition);
        await _context.SaveChangesAsync();
    }
}