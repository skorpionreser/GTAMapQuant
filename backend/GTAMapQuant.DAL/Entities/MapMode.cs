using System.ComponentModel.DataAnnotations;

namespace GTAMapQuant.DAL.Entities;

public class MapMode
{
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsDefault { get; set; }
    public bool IsSystem { get; set; }
    public bool ShowStandardMarkersByDefault { get; set; }
    public ICollection<MapModeArea> MapModeAreas { get; set; } = new List<MapModeArea>();
    public ICollection<MapModeMarker> MapModeMarkers { get; set; } = new List<MapModeMarker>();
}
