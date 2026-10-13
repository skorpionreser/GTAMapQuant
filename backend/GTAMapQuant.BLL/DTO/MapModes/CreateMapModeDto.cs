namespace GTAMapQuant.BLL.DTO.MapModes;

public class CreateMapModeDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsDefault { get; set; }
    public bool ShowStandardMarkersByDefault { get; set; }
    public ICollection<Guid> MapMarkerIds { get; set; } = new List<Guid>();
    public ICollection<Guid> MapAreaIds { get; set; } = new List<Guid>();
}
