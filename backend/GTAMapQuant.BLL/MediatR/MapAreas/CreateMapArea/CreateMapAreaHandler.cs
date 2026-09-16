using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapAreas.CreateMapArea;

public class CreateMapAreaHandler : IRequestHandler<CreateMapAreaCommand, Result<MapAreaDto>>
{
    private readonly GtaMapDbContext _context;

    public CreateMapAreaHandler(GtaMapDbContext context)
    {
        _context = context;
    }
    public async Task<Result<MapAreaDto>> Handle(CreateMapAreaCommand request, CancellationToken cancellationToken)
    {
        Guid areaId = Guid.NewGuid();

        var newArea = new MapArea
        {
            Id = areaId,
            Name = request.Area.Name,
            Description = request.Area.Description,
            Color = request.Area.Color,
            Points = request.Area.Points
                .Select(point => new MapAreaPoint
                {
                    Id = Guid.NewGuid(),
                    MapAreaId = areaId,
                    X = point.X,
                    Y = point.Y,
                    Order = point.Order,
                })
                .ToList(),
        };

        _context.MapAreas.Add(newArea);
        await _context.SaveChangesAsync(cancellationToken);

        var areaDto = new MapAreaDto
        {
            Id = newArea.Id,
            Name = newArea.Name,
            Description = newArea.Description,
            Color = newArea.Color,
            Points = newArea.Points
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

        return Result.Ok(areaDto);
    }
}