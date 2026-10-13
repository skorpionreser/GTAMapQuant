using GTAMapQuant.Api.Audit;
using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.BLL.MediatR.MapModes.CreateMapMode;
using GTAMapQuant.BLL.MediatR.MapModes.DeleteMapMode;
using GTAMapQuant.BLL.MediatR.MapModes.GetAllMapModes;
using GTAMapQuant.BLL.MediatR.MapModes.GetMapModeContent;
using GTAMapQuant.BLL.MediatR.MapModes.UpdateMapMode;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GTAMapQuant.Api.Controllers.MapModes;

public class MapModesController : BaseApiController
{
    private readonly IAuditLogger _auditLogger;

    public MapModesController(IAuditLogger auditLogger)
    {
        _auditLogger = auditLogger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new GetAllMapModesQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id,
        [FromQuery] bool? showStandardMarkers,
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new GetMapModeContentQuery(id, showStandardMarkers), cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateMapModeDto mode,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new CreateMapModeCommand(mode), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Created", cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateMapModeDto mode,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new UpdateMapModeCommand(id, mode), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Updated", cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new DeleteMapModeCommand(id), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Deleted", cancellationToken);
        return HandleResult(result);
    }

    private Task LogSuccessfulChange(
        MapModeDto? mode,
        bool isSuccess,
        string action,
        CancellationToken cancellationToken)
    {
        return isSuccess && mode is not null
            ? _auditLogger.LogAsync(User, action, "MapMode", mode.Id, mode.Name, mode, cancellationToken)
            : Task.CompletedTask;
    }
}
