using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapModes.UpdateMapMode;

public sealed class UpdateMapModeHandler
    : IRequestHandler<UpdateMapModeCommand, Result<MapModeDto?>>
{
    private readonly GtaMapDbContext _context;

    public UpdateMapModeHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapModeDto?>> Handle(
        UpdateMapModeCommand request,
        CancellationToken cancellationToken)
    {
        var mapMode = await _context.MapModes.FirstOrDefaultAsync(
            mode => mode.Id == request.Id,
            cancellationToken);

        if (mapMode is null)
        {
            return Result.Ok<MapModeDto?>(null);
        }

        if (mapMode.IsSystem)
        {
            return Result.Fail<MapModeDto?>("System map modes cannot be edited.");
        }

        var areaIds = request.Mode.MapAreaIds.ToHashSet();
        var markerIds = request.Mode.MapMarkerIds.ToHashSet();
        var existingAreaIds = await _context.MapAreas
            .Where(area => areaIds.Contains(area.Id))
            .Select(area => area.Id)
            .ToHashSetAsync(cancellationToken);
        var existingMarkerIds = await _context.MapMarkers
            .Where(marker => markerIds.Contains(marker.Id))
            .Select(marker => marker.Id)
            .ToHashSetAsync(cancellationToken);

        if (existingAreaIds.Count != areaIds.Count)
        {
            return Result.Fail<MapModeDto?>("One or more map areas do not exist.");
        }

        if (existingMarkerIds.Count != markerIds.Count)
        {
            return Result.Fail<MapModeDto?>("One or more map markers do not exist.");
        }

        if (mapMode.IsDefault && !request.Mode.IsDefault)
        {
            var hasAnotherDefault = await _context.MapModes.AnyAsync(
                mode => mode.Id != mapMode.Id && mode.IsDefault,
                cancellationToken);

            if (!hasAnotherDefault)
            {
                return Result.Fail<MapModeDto?>("At least one default map mode is required.");
            }
        }

        if (request.Mode.IsDefault)
        {
            var currentDefaultModes = await _context.MapModes
                .Where(mode => mode.Id != mapMode.Id && mode.IsDefault)
                .ToListAsync(cancellationToken);

            foreach (var currentDefaultMode in currentDefaultModes)
            {
                currentDefaultMode.IsDefault = false;
            }
        }

        var existingAreaLinks = await _context.MapModeAreas
            .Where(link => link.MapModeId == mapMode.Id)
            .ToListAsync(cancellationToken);
        var existingMarkerLinks = await _context.MapModeMarkers
            .Where(link => link.MapModeId == mapMode.Id)
            .ToListAsync(cancellationToken);
        _context.MapModeAreas.RemoveRange(existingAreaLinks);
        _context.MapModeMarkers.RemoveRange(existingMarkerLinks);

        mapMode.Name = request.Mode.Name.Trim();
        mapMode.Description = request.Mode.Description;
        mapMode.SortOrder = request.Mode.SortOrder;
        mapMode.IsDefault = request.Mode.IsDefault;
        mapMode.ShowStandardMarkersByDefault = request.Mode.ShowStandardMarkersByDefault;

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

        return Result.Ok<MapModeDto?>(ToDto(mapMode));
    }

    private static MapModeDto ToDto(MapMode mapMode)
    {
        return new MapModeDto
        {
            Id = mapMode.Id,
            Name = mapMode.Name,
            Description = mapMode.Description,
            SortOrder = mapMode.SortOrder,
            IsDefault = mapMode.IsDefault,
            IsSystem = mapMode.IsSystem,
            ShowStandardMarkersByDefault = mapMode.ShowStandardMarkersByDefault,
        };
    }
}
