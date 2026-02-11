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
    public DbSet<Match> Matches => Set<Match>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        modelBuilder.Entity<Sport>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<Competition>()
            .HasOne(c => c.Sport)
            .WithMany(s => s.Competitions)
            .HasForeignKey(c => c.SportId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Promotion>()
            .HasIndex(p => p.PromoCode)
            .IsUnique();

        modelBuilder.Entity<Bet>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bets)
            .HasForeignKey(b => b.UserId);

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId);

        modelBuilder.Entity<Match>()
            .HasOne(m => m.Competition)
            .WithMany()
            .HasForeignKey(m => m.CompetitionId);

    }
}