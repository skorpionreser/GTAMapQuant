namespace GTAMapQuant.DAL.Entities;

public class MapModeArea
{
    public Guid MapModeId { get; set; }
    public MapMode MapMode { get; set; } = null!;
    public Guid MapAreaId { get; set; }
    public MapArea MapArea { get; set; } = null!;
}
