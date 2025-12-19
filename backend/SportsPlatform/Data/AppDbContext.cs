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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Sport>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<Competition>()
            .HasOne(x => x.Sport)
            .WithMany()
            .HasForeignKey(x => x.SportId);

        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();
    }
}
