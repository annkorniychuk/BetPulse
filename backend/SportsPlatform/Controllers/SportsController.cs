using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsPlatform.Domain.Entities;
using SportsPlatform.Services;

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
    [Authorize]
    public async Task<ActionResult<Sport>> Create(CreateSportRequest request)
    {
        try
        {
            var sport = await _sportService.CreateAsync(request.Name);
            return CreatedAtAction(nameof(GetById), new { id = sport.Id }, sport);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _sportService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}

public class CreateSportRequest
{
    public string Name { get; set; } = null!;
}