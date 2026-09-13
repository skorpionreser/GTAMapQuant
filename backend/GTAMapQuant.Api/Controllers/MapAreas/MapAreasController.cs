using GTAMapQuant.BLL.MediatR.MapAreas.GetAllMapAreas;
using Microsoft.AspNetCore.Mvc;

namespace GTAMapQuant.Api.Controllers.MapAreas;

public class MapAreasController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new GetAllMapAreasQuery(), cancellationToken));
    }
}