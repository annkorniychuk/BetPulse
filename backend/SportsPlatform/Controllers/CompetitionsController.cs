using Microsoft.AspNetCore.Mvc;
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
    public async Task<ActionResult<List<Competition>>> GetAll()
    {
        var competitions = await _competitionService.GetAllAsync();
        return Ok(competitions);
    }

    // GET
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Competition>> GetById(int id)
    {
        var competition = await _competitionService.GetByIdAsync(id);
        if (competition == null)
            return NotFound();

        return Ok(competition);
    }

    // POST
    [HttpPost]
    public async Task<ActionResult<Competition>> Create(CreateCompetitionRequest request)
    {
        var competition = await _competitionService.CreateAsync(
            request.Name,
            request.SportId
        );

        return CreatedAtAction(nameof(GetById), new { id = competition.Id }, competition);
    }

    // DELETE
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _competitionService.DeleteAsync(id);
        return NoContent();
    }
}

public class CreateCompetitionRequest
{
    public string Name { get; set; } = null!;
    public int SportId { get; set; }
}
