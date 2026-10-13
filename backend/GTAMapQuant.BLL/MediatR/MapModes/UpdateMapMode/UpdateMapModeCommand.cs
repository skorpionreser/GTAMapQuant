using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapModes.UpdateMapMode;

public record UpdateMapModeCommand(Guid Id, UpdateMapModeDto Mode)
    : IRequest<Result<MapModeDto?>>;
