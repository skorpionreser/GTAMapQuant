using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.CreateMapMarker;

public record CreateMapMarkerCommand(CreateMapMarkerDto Marker)
    : IRequest<Result<MapMarkerDto>>;