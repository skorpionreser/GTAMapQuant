using MediatR;
using GTAMapQuant.BLL.DTO.MapMarkers;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.GetAllMapMarkers;

public record GetAllMapMarkersQuery : IRequest<IEnumerable<MapMarkerDto>>;