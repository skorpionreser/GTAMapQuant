using System.ComponentModel.DataAnnotations;

namespace GTAMapQuant.DAL.Entities;

public class MapMarker{
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public MarkerCategory Category { get; set; }

    public double X { get; set; }

    public double Y { get; set; }
}