using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapModes.GetAllMapModes;

public class GetAllMapModesHandler
    : IRequestHandler<GetAllMapModesQuery, Result<IEnumerable<MapModeDto>>>
{
    private readonly GtaMapDbContext _context;

    public GetAllMapModesHandler(GtaMapDbContext context)
    {
        _context = context;
    }
    public async Task<Result<IEnumerable<MapModeDto>>> Handle(
        GetAllMapModesQuery request,
        CancellationToken cancellationToken)
    {
        var mapModes = await _context.MapModes
            .AsNoTracking()
            .OrderByDescending(mapMode => mapMode.IsDefault)
            .ThenBy(mapMode => mapMode.SortOrder)
            .Select(mapMode => new MapModeDto
            {
                Id = mapMode.Id,
                Name = mapMode.Name,
                Description = mapMode.Description,
                SortOrder = mapMode.SortOrder,
                IsDefault = mapMode.IsDefault,
                IsSystem = mapMode.IsSystem,
                ShowStandardMarkersByDefault = mapMode.ShowStandardMarkersByDefault,
            })
            .ToListAsync(cancellationToken);

        return Result.Ok<IEnumerable<MapModeDto>>(mapModes);
    }
}
