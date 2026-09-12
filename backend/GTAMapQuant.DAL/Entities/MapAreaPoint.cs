namespace GTAMapQuant.DAL.Entities;

public class MapAreaPoint
{
    public Guid Id { get; set; }
    public Guid MapAreaId { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
    public int Order { get; set; }
    public MapArea MapArea { get; set; } = null!;
}