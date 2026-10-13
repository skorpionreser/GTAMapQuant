using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapModes.GetAllMapModes;

public record GetAllMapModesQuery
    : IRequest<Result<IEnumerable<MapModeDto>>>;