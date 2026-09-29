using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapAreas.UpdateMapArea;

public record UpdateMapAreaCommand(Guid Id, UpdateMapAreaDto Area) 
    : IRequest<Result<MapAreaDto?>>;