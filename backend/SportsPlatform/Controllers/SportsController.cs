using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsPlatform.Domain.Entities;
using SportsPlatform.Services;
using SportsPlatform.Dtos;

namespace SportsPlatform.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SportsController : ControllerBase
{
    private readonly SportService _service; 

    public SportsController(SportService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<SportSidebarDto>>> GetAll()
    {
        var sports = await _service.GetAllAsync();

        var result = sports.Select(s => new SportSidebarDto
        {
            Id = s.Id,
            Name = s.Name,
            Competitions = s.Competitions.Select(c => new CompetitionSidebarDto
            {
                Id = c.Id,
                Name = c.Name,
                Country = c.Country ?? "Світ",
                Count = 0 // Поки 0, бо логіка підрахунку матчів складна, зробимо пізніше
            }).ToList()
        }).ToList();

        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Sport>> Create([FromBody] CreateSportRequest request)
    {
        var sport = await _service.CreateAsync(request.Name);
        return Ok(sport);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSportRequest request)
    {
        try
        {
            await _service.UpdateAsync(id, request.Name);
            return Ok("Назву спорту оновлено");
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}

public class CreateSportRequest
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateSportRequest
{
    public string Name { get; set; } = string.Empty;
}