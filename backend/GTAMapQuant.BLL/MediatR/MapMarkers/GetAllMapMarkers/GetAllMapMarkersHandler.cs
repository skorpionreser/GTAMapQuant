using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.GetAllMapMarkers;

public class GetAllMapMarkersHandler : IRequestHandler<GetAllMapMarkersQuery, IEnumerable<MapMarkerDto>>
{
    private readonly GtaMapDbContext _context;

    public GetAllMapMarkersHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MapMarkerDto>> Handle(GetAllMapMarkersQuery request, CancellationToken cancellationToken)
    {
        return await _context.MapMarkers
            .AsNoTracking()
            .Select(marker => new MapMarkerDto
            {
                Id = marker.Id,
                Name = marker.Name,
                Description = marker.Description,
                Category = marker.Category,
                X = marker.X,
                Y = marker.Y
            })
            .ToListAsync(cancellationToken);
    }
}