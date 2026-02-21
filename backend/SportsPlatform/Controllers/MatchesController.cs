using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Controllers;

[ApiController]
[Route("api/matches")]
public class MatchesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MatchesController(AppDbContext context)
    {
        _context = context;
    }

    // Цей метод шукає матчі по ID турніру і сортує їх за часом початку
    [HttpGet]
    public async Task<ActionResult<List<Match>>> GetMatchesByCompetition([FromQuery] int competitionId)
    {
        var matches = await _context.Matches
            .Where(m => m.CompetitionId == competitionId)
            .OrderBy(m => m.StartTime)
            .ToListAsync();

        if (matches == null || matches.Count == 0)
        {
            return Ok(new List<Match>()); // Повертаємо пустий список, якщо матчів нема
        }

        return Ok(matches);
    }
}