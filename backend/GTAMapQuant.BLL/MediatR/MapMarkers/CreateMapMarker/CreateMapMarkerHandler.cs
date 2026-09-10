using FluentResults;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.CreateMapMarker;

public class CreateMapMarkerHandler
    : IRequestHandler<CreateMapMarkerCommand, Result<MapMarkerDto>>
{
    private readonly GtaMapDbContext _context;

    public CreateMapMarkerHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapMarkerDto>> Handle(
        CreateMapMarkerCommand request,
        CancellationToken cancellationToken)
    {
        var newMarker = new MapMarker
        {
            Id = Guid.NewGuid(),
            Name = request.Marker.Name,
            Description = request.Marker.Description,
            Category = request.Marker.Category,
            X = request.Marker.X,
            Y = request.Marker.Y,
        };

        _context.MapMarkers.Add(newMarker);
        await _context.SaveChangesAsync(cancellationToken);

        var mapMarkerDto = new MapMarkerDto
        {
            Id = newMarker.Id,
            Name = newMarker.Name,
            Description = newMarker.Description,
            Category = newMarker.Category,
            X = newMarker.X,
            Y = newMarker.Y,
        };

        return Result.Ok(mapMarkerDto);
    }
}