using FluentResults;
using FluentValidation;
using GTAMapQuant.BLL.MediatR.Behaviors;
using Xunit;

namespace GTAMapQuant.XUnitTest.MediatRTests;

public class ValidationBehaviorTests
{
    [Fact]
    public async Task Handle_WhenThereAreNoValidators_ShouldCallNextHandler()
    {
        var behavior = new ValidationBehavior<TestRequest, string>([]);
        var wasNextHandlerCalled = false;

        var result = await behavior.Handle(
            new TestRequest("Valid name"),
            _ =>
            {
                wasNextHandlerCalled = true;
                return Task.FromResult("Handled");
            },
            CancellationToken.None);

        Assert.True(wasNextHandlerCalled);
        Assert.Equal("Handled", result);
    }

    [Fact]
    public async Task Handle_WhenRequestIsValid_ShouldCallNextHandler()
    {
        var behavior = new ValidationBehavior<TestRequest, string>([new TestRequestValidator()]);

        var result = await behavior.Handle(
            new TestRequest("Valid name"),
            _ => Task.FromResult("Handled"),
            CancellationToken.None);

        Assert.Equal("Handled", result);
    }

    [Fact]
    public async Task Handle_WhenRequestIsInvalid_ShouldThrowValidationException()
    {
        var behavior = new ValidationBehavior<TestRequest, string>([new TestRequestValidator()]);

        await Assert.ThrowsAsync<ValidationException>(() => behavior.Handle(
            new TestRequest(string.Empty),
            _ => Task.FromResult("Handled"),
            CancellationToken.None));
    }

    private sealed record TestRequest(string Name);

    private sealed class TestRequestValidator : AbstractValidator<TestRequest>
    {
        public TestRequestValidator()
        {
            RuleFor(request => request.Name).NotEmpty();
        }
    }
}
