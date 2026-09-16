namespace GTAMapQuant.BLL.DTO.MapAreas;

public class CreateMapAreaDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Color { get; set; } = string.Empty;
    public IEnumerable<CreateMapAreaPointDto> Points { get; set; } = new List<CreateMapAreaPointDto>();
}