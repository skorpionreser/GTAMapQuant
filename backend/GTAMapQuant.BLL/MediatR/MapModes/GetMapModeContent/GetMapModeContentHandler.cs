using FluentResults;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapModes.GetMapModeContent;

public class GetMapModeContentHandler
    : IRequestHandler<GetMapModeContentQuery, Result<MapModeContentDto?>>
{
    private readonly GtaMapDbContext _context;

    public GetMapModeContentHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapModeContentDto?>> Handle(GetMapModeContentQuery request, CancellationToken cancellationToken)
    {
        var mapMode = await _context.MapModes
            .AsNoTracking()
            .Where(mapMode => mapMode.Id == request.MapModeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (mapMode is null)
        {
            return Result.Ok<MapModeContentDto?>(null);
        }

        var showStandardMarkers =
            request.ShowStandardMarkers ?? mapMode.ShowStandardMarkersByDefault;

        var areas = await _context.MapModeAreas
            .AsNoTracking()
            .Where(link => link.MapModeId == mapMode.Id)
            .Select(link => new MapAreaDto
            {
                Id = link.MapArea.Id,
                Name = link.MapArea.Name,
                Description = link.MapArea.Description,
                Color = link.MapArea.Color,
                Points = link.MapArea.Points
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

        var markers = await _context.MapModeMarkers
            .AsNoTracking()
            .Where(link => link.MapModeId == mapMode.Id)
            .Select(link => new MapMarkerDto
            {
                Id = link.MapMarker.Id,
                Name = link.MapMarker.Name,
                Description = link.MapMarker.Description,
                Category = link.MapMarker.Category,
                IsStandard = link.MapMarker.IsStandard,
                X = link.MapMarker.X,
                Y = link.MapMarker.Y,
            })
            .ToListAsync(cancellationToken);

        if (showStandardMarkers)
        {
            var standardMarkers = await _context.MapMarkers
                .AsNoTracking()
                .Where(marker => marker.IsStandard)
                .Select(marker => new MapMarkerDto
                {
                    Id = marker.Id,
                    Name = marker.Name,
                    Description = marker.Description,
                    Category = marker.Category,
                    IsStandard = marker.IsStandard,
                    X = marker.X,
                    Y = marker.Y,
                })
                .ToListAsync(cancellationToken);

            var allMarkers = markers.Concat(standardMarkers)
                .DistinctBy(marker => marker.Id)
                .ToList();

            markers = allMarkers;
        }

        var mapModeContentDto = new MapModeContentDto
        {
            Id = mapMode.Id,
            Name = mapMode.Name,
            Description = mapMode.Description,
            ShowStandardMarkers = showStandardMarkers,
            Areas = areas,
            Markers = markers,
        };

        return Result.Ok<MapModeContentDto?>(mapModeContentDto);
    }
}
