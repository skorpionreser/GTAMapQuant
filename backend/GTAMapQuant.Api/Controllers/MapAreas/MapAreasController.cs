using GTAMapQuant.Api.Audit;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.BLL.MediatR.MapAreas.CreateMapArea;
using GTAMapQuant.BLL.MediatR.MapAreas.DeleteMapArea;
using GTAMapQuant.BLL.MediatR.MapAreas.GetAllMapAreas;
using GTAMapQuant.BLL.MediatR.MapAreas.UpdateMapArea;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GTAMapQuant.Api.Controllers.MapAreas;

public class MapAreasController : BaseApiController
{
    private readonly IAuditLogger _auditLogger;

    public MapAreasController(IAuditLogger auditLogger)
    {
        _auditLogger = auditLogger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new GetAllMapAreasQuery(), cancellationToken));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateMapAreaDto area,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new CreateMapAreaCommand(area), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Created", cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateMapAreaDto area,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new UpdateMapAreaCommand(id, area), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Updated", cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new DeleteMapAreaCommand(id), cancellationToken);
        await LogSuccessfulChange(result.Value, result.IsSuccess, "Deleted", cancellationToken);
        return HandleResult(result);
    }

    private Task LogSuccessfulChange(
        MapAreaDto? area,
        bool isSuccess,
        string action,
        CancellationToken cancellationToken)
    {
        return isSuccess && area is not null
            ? _auditLogger.LogAsync(User, action, "MapArea", area.Id, area.Name, area, cancellationToken)
            : Task.CompletedTask;
    }
}
