using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.GetAllMapMarkers;

public class GetAllMapMarkersHandler : IRequestHandler<GetAllMapMarkersQuery, Result<IEnumerable<MapMarkerDto>>>
{
    private readonly GtaMapDbContext _context;

    public GetAllMapMarkersHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<IEnumerable<MapMarkerDto>>> Handle(
        GetAllMapMarkersQuery request,
        CancellationToken cancellationToken)

    {
        var markers = await _context.MapMarkers
            .AsNoTracking()
            .Select(marker => new MapMarkerDto
            {
                Id = marker.Id,
                Name = marker.Name,
                Description = marker.Description,
                Category = marker.Category,
                X = marker.X,
                Y = marker.Y,
            })
            .ToListAsync(cancellationToken);

        return Result.Ok<IEnumerable<MapMarkerDto>>(markers);
    }
}
