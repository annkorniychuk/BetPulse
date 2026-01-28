using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; 
using SportsPlatform.Services;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Controllers;

[ApiController]
[Route("api/competitions")]
public class CompetitionsController : ControllerBase
{
    private readonly CompetitionService _competitionService;

    public CompetitionsController(CompetitionService competitionService)
    {
        _competitionService = competitionService;
    }

    // GET
    [HttpGet]
    public async Task<ActionResult<List<Competition>>> GetAll([FromQuery] string? search)
    {
        var competitions = await _competitionService.GetAllAsync(search);
        return Ok(competitions);
    }

    // GET
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Competition>> GetById(int id)
    {
        var competition = await _competitionService.GetByIdAsync(id);
        if (competition == null)
            return NotFound("Змагання не знайдено");

        return Ok(competition);
    }

    // POST
    [HttpPost]
    [Authorize] 
    public async Task<ActionResult<Competition>> Create(CreateCompetitionRequest request)
    {
        try
        {
            var competition = await _competitionService.CreateAsync(
                request.Name,
                request.SportId
            );

            return CreatedAtAction(nameof(GetById), new { id = competition.Id }, competition);
        }
        catch (KeyNotFoundException ex) 
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
            await _competitionService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex) 
        {
            return NotFound(ex.Message);
        }
    }
}

public class CreateCompetitionRequest
{
    public string Name { get; set; } = null!;
    public int SportId { get; set; }
}