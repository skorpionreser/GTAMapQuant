namespace GTAMapQuant.DAL.Entities;

public class MapModeMarker
{
    public Guid MapModeId { get; set; }
    public MapMode MapMode { get; set; } = null!;
    public Guid MapMarkerId { get; set; }
    public MapMarker MapMarker { get; set; } = null!;
}
