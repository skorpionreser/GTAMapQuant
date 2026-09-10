using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.DeleteMapMarker;

public class DeleteMapMarkerHandler
    : IRequestHandler<DeleteMapMarkerCommand, Result<MapMarkerDto?>>
{
    private readonly GtaMapDbContext _context;

    public DeleteMapMarkerHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapMarkerDto?>> Handle(DeleteMapMarkerCommand request, CancellationToken cancellationToken)
    {
        var mapMarker = await _context.MapMarkers.FirstOrDefaultAsync(
            marker => marker.Id == request.Id,
            cancellationToken);

        if (mapMarker == null)
        {
            return Result.Ok<MapMarkerDto?>(null);
        }

        var markerDto = new MapMarkerDto
        {
            Id = mapMarker.Id,
            Name = mapMarker.Name,
            Description = mapMarker.Description,
            Category = mapMarker.Category,
            X = mapMarker.X,
            Y = mapMarker.Y,
        };

        _context.MapMarkers.Remove(mapMarker);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Ok<MapMarkerDto?>(markerDto);
    }
}