using System.ComponentModel.DataAnnotations;

namespace GTAMapQuant.DAL.Entities;

public class MapArea
{
    public Guid Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Color { get; set; } = string.Empty;
    public ICollection<MapAreaPoint> Points { get; set; } = new List<MapAreaPoint>();
}