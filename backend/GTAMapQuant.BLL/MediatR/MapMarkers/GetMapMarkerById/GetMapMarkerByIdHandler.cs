using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using FluentResults;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.GetMapMarkerById;

public class GetMapMarkerByIdHandler : IRequestHandler<GetMapMarkerByIdQuery, Result<MapMarkerDto?>>
{
    private readonly GtaMapDbContext _context;

    public GetMapMarkerByIdHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapMarkerDto?>> Handle(
        GetMapMarkerByIdQuery request,
        CancellationToken cancellationToken)
    {
        var marker = await _context.MapMarkers
            .AsNoTracking()
            .Where(marker => marker.Id == request.Id)
            .Select(marker => new MapMarkerDto
            {
                Id = marker.Id,
                Name = marker.Name,
                Description = marker.Description,
                Category = marker.Category,
                X = marker.X,
                Y = marker.Y
            })
            .FirstOrDefaultAsync(cancellationToken);

        return Result.Ok<MapMarkerDto?>(marker);
    }
}