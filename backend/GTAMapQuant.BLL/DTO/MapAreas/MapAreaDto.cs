namespace GTAMapQuant.BLL.DTO.MapAreas;

public class MapAreaDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Color { get; set; } = string.Empty;
    public IEnumerable<MapAreaPointDto> Points { get; set; } = new List<MapAreaPointDto>();
}
