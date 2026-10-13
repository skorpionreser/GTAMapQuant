using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.BLL.DTO.MapMarkers;

namespace GTAMapQuant.BLL.DTO.MapModes;

public class MapModeContentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool ShowStandardMarkers { get; set; }

    public IEnumerable<MapAreaDto> Areas { get; set; } = new List<MapAreaDto>();
    public IEnumerable<MapMarkerDto> Markers { get; set; } = new List<MapMarkerDto>();
}