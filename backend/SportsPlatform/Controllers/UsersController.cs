using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Dtos;
using SportsPlatform.Domain.Entities;
using System.Security.Claims;

namespace SportsPlatform.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Всі методи потребують авторизації
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // Отримати профіль
    [HttpGet("profile")]
    public async Task<ActionResult<User>> GetProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);
        return Ok(user);
    }

    // Додати в улюблене
    [HttpPost("favorites/{competitionId}")]
    public async Task<IActionResult> AddFavorite(int competitionId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var exists = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.CompetitionId == competitionId);
        if (exists) return BadRequest("Вже в улюбленому");

        var favorite = new Favorite { UserId = userId, CompetitionId = competitionId };
        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
        return Ok();
    }

    // Історія ставок
    [HttpGet("bets")]
    public async Task<ActionResult<List<Bet>>> GetMyBets()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return await _context.Bets.Where(b => b.UserId == userId).ToListAsync();
    }
}