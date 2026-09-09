using GTAMapQuant.DAL.Entities;

namespace GTAMapQuant.BLL.DTO.MapMarkers;

public class CreateMapMarkerDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public MarkerCategory Category { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
}
