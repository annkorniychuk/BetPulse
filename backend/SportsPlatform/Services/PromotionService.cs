using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Services;

public class PromotionService
{
    private readonly AppDbContext _db;

    public PromotionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Promotion>> GetAllAsync()
    {
        return await _db.Promotions
            .Where(p => p.EndDate > DateTime.UtcNow)
            .OrderBy(p => p.StartDate)
            .ToListAsync();
    }

    public async Task CreateAsync(string name, string promoCode, string description, decimal discount)
    {
        var promo = new Promotion
        {
            Name = name,
            PromoCode = promoCode,
            Description = description,
            DiscountPercentage = discount,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(30)
        };

        _db.Promotions.Add(promo);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var promo = await _db.Promotions.FindAsync(id);
        if (promo != null)
        {
            _db.Promotions.Remove(promo);
            await _db.SaveChangesAsync();
        }
    }
}