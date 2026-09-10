using GTAMapQuant.BLL.DTO.MapMarkers;
using MediatR;
using FluentResults;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.GetMapMarkerById;

public record GetMapMarkerByIdQuery(Guid Id)
    : IRequest<Result<MapMarkerDto?>>;