using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsPlatform.Services;

namespace SportsPlatform.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromotionsController : ControllerBase
{
    private readonly PromotionService _service;

    public PromotionsController(PromotionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var promos = await _service.GetAllAsync();
        return Ok(promos);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreatePromoRequest request)
    {
        await _service.CreateAsync(request.Name, request.PromoCode, request.Description, request.Discount);
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }
}

public class CreatePromoRequest
{
    public string Name { get; set; } = string.Empty;
    public string PromoCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Discount { get; set; }
}