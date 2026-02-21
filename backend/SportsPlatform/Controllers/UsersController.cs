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
            user.Email,
            user.Balance
        });
    }

    /* Оновити ім'я та пошту 
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
    } */

    // оновити тільки пошту
    [HttpPut("update-email")]
    public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
            return BadRequest("Некоректний формат пошти");

        var userId = GetCurrentUserId();
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        if (user.Email == request.Email)
            return Ok("Введіть нову пошту");

        var emailTaken = await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != userId);
        if (emailTaken)
            return BadRequest("Ця електронна пошта вже використовується іншим користувачем");

        user.Email = request.Email;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Пошту успішно оновлено", newEmail = user.Email });
    }
    // оновити тільки ім'я
    [HttpPut("update-name")]
    public async Task<IActionResult> UpdateName([FromBody] UpdateNameRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Ім'я не може бути пустим");

        var userId = GetCurrentUserId();
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        user.Name = request.Name;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Ім'я успішно оновлено", newName = user.Name });
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

    // Отримати всіх користувачів
    [HttpGet("/api/users")]
    [AllowAnonymous]
    //[Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new { u.Id, u.Name, u.Email, u.Role })
            .ToListAsync();

        return Ok(users);
    }


// Адмінське оновлення користувача
    [HttpPut("/api/users/{id}")]
    // [Authorize(Roles = "Admin")] // Розкоментуй, коли налаштуєш ролі
    public async Task<IActionResult> UpdateUserAsAdmin(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound("Користувача не знайдено");

        // Оновлюємо ім'я
        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            user.Name = request.Name;
        }

        // Оновлюємо пошту (з перевіркою на унікальність)
        if (!string.IsNullOrWhiteSpace(request.Email) && user.Email != request.Email)
        {
            var emailTaken = await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id);
            if (emailTaken) return BadRequest("Ця пошта вже зайнята");
            user.Email = request.Email;
        }

        // Оновлюємо роль
        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            user.Role = request.Role;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Користувача оновлено" });
    }

}


public class UpdateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class UpdateNameRequest
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateEmailRequest
{
    public string Email { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}