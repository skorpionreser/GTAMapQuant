using GTAMapQuant.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.DAL.Data;

public class GtaMapDbContext : DbContext
{
    public GtaMapDbContext(DbContextOptions<GtaMapDbContext> options)
        : base(options)
    {
    }

    public DbSet<MapMarker> MapMarkers => Set<MapMarker>();
    public DbSet<MapArea> MapAreas => Set<MapArea>();
    public DbSet<MapAreaPoint> MapAreaPoints => Set<MapAreaPoint>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AdminUser>()
            .HasIndex(user => user.Login)
            .IsUnique();
    }
}
