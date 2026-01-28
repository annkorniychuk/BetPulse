using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsPlatform.Domain.Entities;
using SportsPlatform.Services;

namespace SportsPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Ставки тільки для авторизованих
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

			var bet = await _service.PlaceBetAsync(userId, request.CompetitionId, request.Amount, request.Odd);

			return Ok(new { message = "Ставку прийнято!", betId = bet.Id, potentialWin = bet.PotentialWin });
		}
		catch (Exception ex)
		{
			return BadRequest(ex.Message);
		}
	}
}

public class CreateBetRequest
{
	public int CompetitionId { get; set; }
	public decimal Amount { get; set; }
	public decimal Odd { get; set; } 
}