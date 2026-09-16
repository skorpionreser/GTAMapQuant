using GTAMapQuant.BLL.MediatR.MapAreas.GetAllMapAreas;
using Microsoft.AspNetCore.Mvc;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.BLL.MediatR.MapAreas.CreateMapArea;

namespace GTAMapQuant.Api.Controllers.MapAreas;

public class MapAreasController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new GetAllMapAreasQuery(), cancellationToken));
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateMapAreaDto area,
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new CreateMapAreaCommand(area), cancellationToken));
    }
}