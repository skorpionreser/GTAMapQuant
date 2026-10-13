using System;

namespace GTAMapQuant.BLL.DTO.MapModes;

public class MapModeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsDefault { get; set; }
    public bool IsSystem { get; set; }
    public bool ShowStandardMarkersByDefault { get; set; }
}
