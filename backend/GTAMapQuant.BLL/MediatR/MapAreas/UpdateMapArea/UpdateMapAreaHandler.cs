using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapAreas.UpdateMapArea;

public class UpdateMapAreaHandler : IRequestHandler<UpdateMapAreaCommand, Result<MapAreaDto?>>
{
    private readonly GtaMapDbContext _context;

    public UpdateMapAreaHandler(GtaMapDbContext context)
    {
        _context = context;
    }
    public async Task<Result<MapAreaDto?>> Handle(UpdateMapAreaCommand request, CancellationToken cancellationToken)
    {
        var area = await _context.MapAreas
            .Include(area => area.Points)
            .FirstOrDefaultAsync(
                area => area.Id == request.Id, cancellationToken);
        
        if (area == null)
        {
            return Result.Ok<MapAreaDto?>(null);
        }

        area.Name = request.Area.Name;
        area.Description = request.Area.Description;
        area.Color = request.Area.Color;

        _context.MapAreaPoints.RemoveRange(area.Points);
        var updatedPoints = request.Area.Points
            .Select(point => new MapAreaPoint
            {
                Id = Guid.NewGuid(),
                MapAreaId = area.Id,
                X = point.X,
                Y = point.Y,
                Order = point.Order,
            })
            .ToList();

        _context.MapAreaPoints.AddRange(updatedPoints);
        area.Points = updatedPoints;

        await _context.SaveChangesAsync(cancellationToken);

        var areaDto = new MapAreaDto
        {
            Id = area.Id,
            Name = area.Name,
            Description = area.Description,
            Color = area.Color,
            Points = area.Points
                .OrderBy(point => point.Order)
                .Select(point => new MapAreaPointDto
                {
                    Id = point.Id,
                    X = point.X,
                    Y = point.Y,
                    Order = point.Order,
                })
                .ToList(),
        };

        return Result.Ok<MapAreaDto?>(areaDto);
    }
}
