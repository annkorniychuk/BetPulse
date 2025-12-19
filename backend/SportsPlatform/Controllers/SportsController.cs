using Microsoft.AspNetCore.Mvc;
using SportsPlatform.Services;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Controllers;

[ApiController]
[Route("api/sports")]
public class SportsController : ControllerBase
{
    private readonly SportService _sportService;

    public SportsController(SportService sportService)
    {
        _sportService = sportService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Sport>>> GetAll()
    {
        var sports = await _sportService.GetAllAsync();
        return Ok(sports);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Sport>> GetById(int id)
    {
        var sport = await _sportService.GetByIdAsync(id);
        if (sport == null)
            return NotFound();

        return Ok(sport);
    }

    [HttpPost]
    public async Task<ActionResult<Sport>> Create(CreateSportRequest request)
    {
        var sport = await _sportService.CreateAsync(request.Name);
        return CreatedAtAction(nameof(GetById), new { id = sport.Id }, sport);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _sportService.DeleteAsync(id);
        return NoContent();
    }
}

public class CreateSportRequest
{
    public string Name { get; set; } = null!;
}
