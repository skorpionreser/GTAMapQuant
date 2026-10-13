using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapModes.CreateMapMode;

public record CreateMapModeCommand(CreateMapModeDto Mode)
    : IRequest<Result<MapModeDto>>;
