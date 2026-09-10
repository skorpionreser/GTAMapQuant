using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.UpdateMapMarker;

public record UpdateMapMarkerCommand(Guid Id, UpdateMapMarkerDto Marker)
    : IRequest<Result<MapMarkerDto?>>;