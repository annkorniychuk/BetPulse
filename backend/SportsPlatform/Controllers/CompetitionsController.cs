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

    [HttpGet]
    public async Task<ActionResult<List<Competition>>> GetAll([FromQuery] string? search)
    {
        var competitions = await _competitionService.GetAllAsync(search);
        return Ok(competitions);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Competition>> GetById(int id)
    {
        var competition = await _competitionService.GetByIdAsync(id);
        if (competition == null)
            return NotFound("Змагання не знайдено");

        return Ok(competition);
    }

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
        await _competitionService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] CreateCompetitionRequest request)
    {
        try
        {
            await _competitionService.UpdateAsync(id, request.Name, request.SportId);
            return Ok("Змагання успішно оновлено");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

public class CreateCompetitionRequest
{
    public string Name { get; set; } = null!;
    public int SportId { get; set; }
}