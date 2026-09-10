using FluentResults;
using GTAMapQuant.BLL.MediatR.ResultVariations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GTAMapQuant.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    private IMediator? _mediator;

    protected IMediator Mediator => _mediator ??=
        HttpContext.RequestServices.GetService<IMediator>()!;

    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            if (result is NullResult<T>)
            {
                return Ok(result.Value);
            }

            return result.Value is null
                ? NotFound("Found result matching null")
                : Ok(result.Value);
        }

        return BadRequest(result.Reasons);
    }
}