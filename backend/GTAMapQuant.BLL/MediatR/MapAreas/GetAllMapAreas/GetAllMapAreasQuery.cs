using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapAreas.GetAllMapAreas;

public record GetAllMapAreasQuery
    : IRequest<Result<IEnumerable<MapAreaDto>>>;