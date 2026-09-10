using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.UpdateMapMarker;

public class UpdateMapMarkerHandler
    : IRequestHandler<UpdateMapMarkerCommand, Result<MapMarkerDto?>>
{
    private readonly GtaMapDbContext _context;

    public UpdateMapMarkerHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapMarkerDto?>> Handle(UpdateMapMarkerCommand request, CancellationToken cancellationToken)
    {
        var mapMarker = await _context.MapMarkers.FirstOrDefaultAsync(
            marker => marker.Id == request.Id,
            cancellationToken);

        if (mapMarker == null)
        {
            return Result.Ok<MapMarkerDto?>(null);
        }

        mapMarker.Name = request.Marker.Name;
        mapMarker.Description = request.Marker.Description;
        mapMarker.Category = request.Marker.Category;
        mapMarker.X = request.Marker.X;
        mapMarker.Y = request.Marker.Y;

        await _context.SaveChangesAsync(cancellationToken);

        var mapMarkerDto = new MapMarkerDto
        {
            Id = mapMarker.Id,
            Name = mapMarker.Name,
            Description = mapMarker.Description,
            Category = mapMarker.Category,
            X = mapMarker.X,
            Y = mapMarker.Y,
        };

        return Result.Ok<MapMarkerDto?>(mapMarkerDto);
    }
}