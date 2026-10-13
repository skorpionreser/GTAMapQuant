using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapModes.CreateMapMode;

public sealed class CreateMapModeHandler
    : IRequestHandler<CreateMapModeCommand, Result<MapModeDto>>
{
    private readonly GtaMapDbContext _context;

    public CreateMapModeHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapModeDto>> Handle(
        CreateMapModeCommand request,
        CancellationToken cancellationToken)
    {
        var areaIds = request.Mode.MapAreaIds.ToHashSet();
        var markerIds = request.Mode.MapMarkerIds.ToHashSet();

        var existingAreaIds = await _context.MapAreas
            .Where(area => areaIds.Contains(area.Id))
            .Select(area => area.Id)
            .ToHashSetAsync(cancellationToken);

        if (existingAreaIds.Count != areaIds.Count)
        {
            return Result.Fail<MapModeDto>("One or more map areas do not exist.");
        }

        var existingMarkerIds = await _context.MapMarkers
            .Where(marker => markerIds.Contains(marker.Id))
            .Select(marker => marker.Id)
            .ToHashSetAsync(cancellationToken);

        if (existingMarkerIds.Count != markerIds.Count)
        {
            return Result.Fail<MapModeDto>("One or more map markers do not exist.");
        }

        if (request.Mode.IsDefault)
        {
            var currentDefaultModes = await _context.MapModes
                .Where(mode => mode.IsDefault)
                .ToListAsync(cancellationToken);

            foreach (var currentDefaultMode in currentDefaultModes)
            {
                currentDefaultMode.IsDefault = false;
            }
        }

        var mapMode = new MapMode
        {
            Id = Guid.NewGuid(),
            Name = request.Mode.Name.Trim(),
            Description = request.Mode.Description,
            SortOrder = request.Mode.SortOrder,
            IsDefault = request.Mode.IsDefault,
            IsSystem = false,
            ShowStandardMarkersByDefault = request.Mode.ShowStandardMarkersByDefault,
        };

        _context.MapModes.Add(mapMode);
        _context.MapModeAreas.AddRange(areaIds.Select(areaId => new MapModeArea
        {
            MapModeId = mapMode.Id,
            MapAreaId = areaId,
        }));
        _context.MapModeMarkers.AddRange(markerIds.Select(markerId => new MapModeMarker
        {
            MapModeId = mapMode.Id,
            MapMarkerId = markerId,
        }));

        await _context.SaveChangesAsync(cancellationToken);

        return Result.Ok(new MapModeDto
        {
            Id = mapMode.Id,
            Name = mapMode.Name,
            Description = mapMode.Description,
            SortOrder = mapMode.SortOrder,
            IsDefault = mapMode.IsDefault,
            IsSystem = mapMode.IsSystem,
            ShowStandardMarkersByDefault = mapMode.ShowStandardMarkersByDefault,
        });
    }
}
