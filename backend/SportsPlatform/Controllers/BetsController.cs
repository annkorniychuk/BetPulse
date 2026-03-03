using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsPlatform.Services;

namespace SportsPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BetsController : ControllerBase
{
    private readonly BetService _service;

    public BetsController(BetService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceBet(CreateBetRequest request)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Передаємо оновлені дані в сервіс
            var bet = await _service.PlaceBetAsync(userId, request.MatchId, request.Choice, request.Amount, request.Odd);

            return Ok(new { message = "Ставку прийнято!", betId = bet.Id, potentialWin = bet.PotentialWin });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetMyBets()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var bets = await _service.GetUserBetsAsync(userId);
        return Ok(bets);
    }
}

public class CreateBetRequest
{
    public int MatchId { get; set; }
    public string Choice { get; set; } = null!;
    public decimal Amount { get; set; }
    public decimal Odd { get; set; }
}