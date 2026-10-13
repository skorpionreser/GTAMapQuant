using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapModes.DeleteMapMode;

public record DeleteMapModeCommand(Guid Id)
    : IRequest<Result<MapModeDto?>>;
