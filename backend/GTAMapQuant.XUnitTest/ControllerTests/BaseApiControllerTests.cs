using FluentResults;
using GTAMapQuant.Api.Controllers;
using GTAMapQuant.BLL.MediatR.ResultVariations;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace GTAMapQuant.XUnitTest.ControllerTests;

public class BaseApiControllerTests
{
    private readonly TestApiController _controller = new();

    [Fact]
    public void HandleResult_WhenResultHasValue_ShouldReturnOk()
    {
        var actionResult = _controller.ExposeHandleResult(Result.Ok("Marker"));

        var result = Assert.IsType<OkObjectResult>(actionResult);
        Assert.Equal("Marker", result.Value);
    }

    [Fact]
    public void HandleResult_WhenSuccessfulResultHasNullValue_ShouldReturnNotFound()
    {
        var actionResult = _controller.ExposeHandleResult(Result.Ok<string>(null!));

        Assert.IsType<NotFoundObjectResult>(actionResult);
    }

    [Fact]
    public void HandleResult_WhenNullResultIsSuccessful_ShouldReturnOk()
    {
        var actionResult = _controller.ExposeHandleResult(new NullResult<string>());

        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]
    public void HandleResult_WhenResultFailed_ShouldReturnBadRequest()
    {
        var actionResult = _controller.ExposeHandleResult(Result.Fail<string>("Failed"));

        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    private sealed class TestApiController : BaseApiController
    {
        public ActionResult ExposeHandleResult<T>(Result<T> result)
        {
            return HandleResult(result);
        }
    }
}
