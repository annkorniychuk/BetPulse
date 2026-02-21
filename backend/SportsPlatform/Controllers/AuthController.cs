using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SportsPlatform.Data;
using SportsPlatform.Dtos;
using SportsPlatform.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SportsPlatform.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(RegisterDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Користувач вже існує.");

        // Хешування паролю
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // ім'я генерується автоматично
        string generatedName = request.Email.Contains("@")
            ? request.Email.Split('@')[0]
            : "User";

        var user = new User
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            Name = generatedName,
            Role = "User" 
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("Реєстрація успішна");
    }

    [HttpPost("login")]
    public async Task<ActionResult<object>> Login(LoginDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            return BadRequest("Користувача не знайдено.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return BadRequest("Невірний пароль.");

        string token = CreateToken(user);

        return Ok(new
        {
            token = token,
            role = user.Role,       
            email = user.Email,     
            id = user.Id            
        });
    }

    private string CreateToken(User user)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}