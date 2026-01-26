namespace SportsPlatform.Domain.Entities;

public class Promotion
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PromoCode { get; set; } = string.Empty;
    public decimal DiscountPercentage { get; set; }
    public DateTime ExpiryDate { get; set; }
}