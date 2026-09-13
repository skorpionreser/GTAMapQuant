using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapAreas.GetAllMapAreas;

public class GetAllMapAreasHandler : IRequestHandler<GetAllMapAreasQuery, Result<IEnumerable<MapAreaDto>>>
{
    private readonly GtaMapDbContext _context;

    public GetAllMapAreasHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<IEnumerable<MapAreaDto>>> Handle(GetAllMapAreasQuery request, CancellationToken cancellationToken)
    {
        var areas = await _context.MapAreas
        .AsNoTracking()
        .Select(area => new MapAreaDto
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
        })
        .ToListAsync(cancellationToken);

    return Result.Ok<IEnumerable<MapAreaDto>>(areas);
    }
}