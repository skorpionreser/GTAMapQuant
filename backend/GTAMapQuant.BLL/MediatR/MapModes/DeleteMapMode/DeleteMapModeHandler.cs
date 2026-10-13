using FluentResults;
using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.MapModes.DeleteMapMode;

public sealed class DeleteMapModeHandler
    : IRequestHandler<DeleteMapModeCommand, Result<MapModeDto?>>
{
    private readonly GtaMapDbContext _context;

    public DeleteMapModeHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<MapModeDto?>> Handle(
        DeleteMapModeCommand request,
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
            return Result.Fail<MapModeDto?>("System map modes cannot be deleted.");
        }

        if (mapMode.IsDefault)
        {
            var hasAnotherDefault = await _context.MapModes.AnyAsync(
                mode => mode.Id != mapMode.Id && mode.IsDefault,
                cancellationToken);

            if (!hasAnotherDefault)
            {
                return Result.Fail<MapModeDto?>("At least one default map mode is required.");
            }
        }

        var areaLinks = await _context.MapModeAreas
            .Where(link => link.MapModeId == mapMode.Id)
            .ToListAsync(cancellationToken);
        var markerLinks = await _context.MapModeMarkers
            .Where(link => link.MapModeId == mapMode.Id)
            .ToListAsync(cancellationToken);
        _context.MapModeAreas.RemoveRange(areaLinks);
        _context.MapModeMarkers.RemoveRange(markerLinks);
        _context.MapModes.Remove(mapMode);
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
