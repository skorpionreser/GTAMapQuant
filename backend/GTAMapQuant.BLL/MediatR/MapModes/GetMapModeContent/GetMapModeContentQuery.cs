using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapModes.GetMapModeContent;

public record GetMapModeContentQuery(
    Guid MapModeId,
    bool? ShowStandardMarkers) : IRequest<Result<MapModeContentDto?>>;