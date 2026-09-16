using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.GetMapMarkerById;

public record GetMapMarkerByIdQuery(Guid Id)
    : IRequest<Result<MapMarkerDto?>>;
