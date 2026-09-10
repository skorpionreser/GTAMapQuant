using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.DeleteMapMarker;

public record DeleteMapMarkerCommand(Guid Id)
    : IRequest<Result<MapMarkerDto?>>;