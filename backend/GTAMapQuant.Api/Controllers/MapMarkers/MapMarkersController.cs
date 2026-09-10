using Microsoft.AspNetCore.Mvc;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.GetAllMapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.GetMapMarkerById;
using GTAMapQuant.BLL.MediatR.MapMarkers.CreateMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.DeleteMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.UpdateMapMarker;

namespace GTAMapQuant.Api.Controllers.MapMarkers;

public class MapMarkersController : BaseApiController
{
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

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateMapMarkerDto marker,
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new CreateMapMarkerCommand(marker), cancellationToken));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateMapMarkerDto marker,
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new UpdateMapMarkerCommand(id, marker), cancellationToken));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        return HandleResult(
            await Mediator.Send(new DeleteMapMarkerCommand(id), cancellationToken));
    }
}
