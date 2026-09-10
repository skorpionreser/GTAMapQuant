using MediatR;
using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.GetAllMapMarkers;

public record GetAllMapMarkersQuery
    : IRequest<Result<IEnumerable<MapMarkerDto>>>;