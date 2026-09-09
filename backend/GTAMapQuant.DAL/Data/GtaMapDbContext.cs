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
}