using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapAreas.CreateMapArea;

public record CreateMapAreaCommand(CreateMapAreaDto Area) 
    : IRequest<Result<MapAreaDto>>;