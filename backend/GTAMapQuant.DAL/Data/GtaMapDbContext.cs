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
    public DbSet<MapMode> MapModes => Set<MapMode>();
    public DbSet<MapModeArea> MapModeAreas => Set<MapModeArea>();
    public DbSet<MapModeMarker> MapModeMarkers => Set<MapModeMarker>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AdminUser>()
            .HasIndex(user => user.Login)
            .IsUnique();

        modelBuilder.Entity<AuditLog>()
            .HasIndex(log => log.CreatedAtUtc);

        modelBuilder.Entity<MapModeArea>()
            .HasKey(link => new { link.MapModeId, link.MapAreaId });
        modelBuilder.Entity<MapModeArea>()
            .HasOne(link => link.MapMode)
            .WithMany(mode => mode.MapModeAreas)
            .HasForeignKey(link => link.MapModeId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<MapModeArea>()
            .HasOne(link => link.MapArea)
            .WithMany(area => area.MapModeAreas)
            .HasForeignKey(link => link.MapAreaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MapModeMarker>()
            .HasKey(link => new { link.MapModeId, link.MapMarkerId });

        modelBuilder.Entity<MapModeMarker>()
            .HasOne(link => link.MapMode)
            .WithMany(mode => mode.MapModeMarkers)
            .HasForeignKey(link => link.MapModeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MapModeMarker>()
            .HasOne(link => link.MapMarker)
            .WithMany(marker => marker.MapModeMarkers)
            .HasForeignKey(link => link.MapMarkerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
