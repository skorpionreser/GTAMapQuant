using GTAMapQuant.Api.Audit;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.CreateMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.DeleteMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.GetAllMapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.GetMapMarkerById;
using GTAMapQuant.BLL.MediatR.MapMarkers.UpdateMapMarker;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GTAMapQuant.Api.Controllers.MapMarkers;

public class MapMarkersController : BaseApiController
{
    private readonly IAuditLogger _auditLogger;

    public MapMarkersController(IAuditLogger auditLogger)
    {
        _auditLogger = auditLogger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new GetAllMapMarkersQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new GetMapMarkerByIdQuery(id), cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateMapMarkerDto marker,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new CreateMapMarkerCommand(marker), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Created", cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateMapMarkerDto marker,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new UpdateMapMarkerCommand(id, marker), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Updated", cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new DeleteMapMarkerCommand(id), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Deleted", cancellationToken);
        return HandleResult(result);
    }

    private Task LogSuccessfulChange(
        MapMarkerDto? marker,
        bool isSuccess,
        string action,
        CancellationToken cancellationToken)
    {
        return isSuccess && marker is not null
            ? _auditLogger.LogAsync(User, action, "MapMarker", marker.Id, marker.Name, marker, cancellationToken)
            : Task.CompletedTask;
    }
}
