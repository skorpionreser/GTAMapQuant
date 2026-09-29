using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapAreas.DeleteMapArea;

public class DeleteMapAreaHandler : IRequestHandler<DeleteMapAreaCommand, Result<MapAreaDto?>>
{
    private readonly GtaMapDbContext _context;

    public DeleteMapAreaHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapAreaDto?>> Handle(DeleteMapAreaCommand request, CancellationToken cancellationToken)
    {
        var area = await _context.MapAreas
            .Include(area => area.Points)
            .FirstOrDefaultAsync(
                area => area.Id == request.Id, cancellationToken);
        
        if (area == null)
        {
            return Result.Ok<MapAreaDto?>(null);
        }

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

        _context.MapAreas.Remove(area);
        await _context.SaveChangesAsync(cancellationToken);
        
        return Result.Ok<MapAreaDto?>(areaDto);
    }
}
