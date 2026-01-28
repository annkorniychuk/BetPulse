using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;
using BCrypt.Net; 

namespace SportsPlatform.Controllers;

[Route("api/profile")] 
[ApiController]
[Authorize] 
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }
    
    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // Отримати профіль 
    [HttpGet]
    public async Task<ActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users.FindAsync(userId);

        if (user == null) return NotFound();

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email
        });
    }

    // Оновити ім'я та пошту 
    [HttpPut("update")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        user.Name = request.Name;
        user.Email = request.Email;

        await _context.SaveChangesAsync();
        return Ok("Дані оновлено");
    }

    // Змінити пароль
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
        {
            return BadRequest("Старий пароль неправильний");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

        await _context.SaveChangesAsync();
        return Ok("Пароль успішно змінено");
    }

    // Додати в улюблене 
    [HttpPost("favorites/{competitionId}")]
    public async Task<IActionResult> AddFavorite(int competitionId)
    {
        var userId = GetCurrentUserId();

        var compExists = await _context.Competitions.AnyAsync(c => c.Id == competitionId);
        if (!compExists) return NotFound("Змагання не існує");

        var exists = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.CompetitionId == competitionId);
        if (exists) return BadRequest("Вже в улюбленому");

        var favorite = new Favorite { UserId = userId, CompetitionId = competitionId };
        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
        return Ok("Додано в улюблене");
    }

    // Мої ставки 
    [HttpGet("bets")]
    public async Task<ActionResult<List<Bet>>> GetMyBets()
    {
        var userId = GetCurrentUserId();
        return await _context.Bets
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.Id)
            .ToListAsync();
    }
}

public class UpdateProfileRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}