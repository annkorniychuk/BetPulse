using Microsoft.EntityFrameworkCore;
using SportsPlatform.Domain.Entities; 

namespace SportsPlatform.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Sport> Sports => Set<Sport>();
    public DbSet<Competition> Competitions => Set<Competition>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<Bet> Bets => Set<Bet>();
    public DbSet<Promotion> Promotions => Set<Promotion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        // Унікальність назви спорту
        modelBuilder.Entity<Sport>()
            .HasIndex(x => x.Name)
            .IsUnique();

        // Зв'язок змагання зі спортом
        modelBuilder.Entity<Competition>()
            .HasOne(x => x.Sport)
            .WithMany()
            .HasForeignKey(x => x.SportId);

        // Унікальність пошти юзера
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        // промокоди унікальнi, щоб не було дублів
        modelBuilder.Entity<Promotion>()
            .HasIndex(p => p.PromoCode)
            .IsUnique();

        // Налаштування зв'язків для ставок 
        modelBuilder.Entity<Bet>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bets)
            .HasForeignKey(b => b.UserId);

        // Налаштування для "Улюбленого"
        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId);
    }
}