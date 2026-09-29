using System;
using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapAreas.DeleteMapArea;

public record DeleteMapAreaCommand(Guid Id) 
    : IRequest<Result<MapAreaDto?>>;