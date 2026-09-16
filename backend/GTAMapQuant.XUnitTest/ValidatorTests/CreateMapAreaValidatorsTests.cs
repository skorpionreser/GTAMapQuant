using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.BLL.MediatR.MapAreas.CreateMapArea;
using GTAMapQuant.BLL.MediatR.MapAreas.Validators;
using Xunit;

namespace GTAMapQuant.XUnitTest.ValidatorTests;

public class CreateMapAreaValidatorsTests
{
    private readonly CreateMapAreaPointDtoValidator _pointValidator = new();
    private readonly CreateMapAreaDtoValidator _areaValidator;
    private readonly CreateMapAreaCommandValidator _commandValidator;

    public CreateMapAreaValidatorsTests()
    {
        _areaValidator = new CreateMapAreaDtoValidator(_pointValidator);
        _commandValidator = new CreateMapAreaCommandValidator(_areaValidator);
    }

    [Fact]
    public void Validate_WhenAreaIsValid_ShouldSucceed()
    {
        var result = _areaValidator.Validate(CreateValidArea());

        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validate_WhenAreaHasLessThanThreePoints_ShouldFail()
    {
        var area = CreateValidArea();
        area.Points = area.Points.Take(2).ToList();

        var result = _areaValidator.Validate(area);

        Assert.Contains(
            result.Errors,
            error => error.PropertyName == nameof(CreateMapAreaDto.Points));
    }

    [Fact]
    public void Validate_WhenColorIsNotHex_ShouldFail()
    {
        var area = CreateValidArea();
        area.Color = "blue";

        var result = _areaValidator.Validate(area);

        Assert.Contains(
            result.Errors,
            error => error.PropertyName == nameof(CreateMapAreaDto.Color));
    }

    [Fact]
    public void Validate_WhenPointOrdersAreDuplicated_ShouldFail()
    {
        var area = CreateValidArea();
        area.Points = new[]
        {
            new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
            new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
            new CreateMapAreaPointDto { X = 20, Y = 20, Order = 1 },
        };

        var result = _areaValidator.Validate(area);

        Assert.Contains(
            result.Errors,
            error => error.ErrorMessage == "Point order values must be unique.");
    }

    [Fact]
    public void Validate_WhenPointCoordinateIsNotFinite_ShouldFail()
    {
        var area = CreateValidArea();
        area.Points = new[]
        {
            new CreateMapAreaPointDto { X = double.NaN, Y = 10, Order = 0 },
            new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
            new CreateMapAreaPointDto { X = 20, Y = 20, Order = 2 },
        };

        var result = _areaValidator.Validate(area);

        Assert.Contains(
            result.Errors,
            error => error.PropertyName.EndsWith(
                nameof(CreateMapAreaPointDto.X),
                StringComparison.Ordinal));
    }

    [Fact]
    public void Validate_WhenPointOrderIsNegative_ShouldFail()
    {
        var area = CreateValidArea();
        area.Points = new[]
        {
            new CreateMapAreaPointDto { X = 10, Y = 10, Order = -1 },
            new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
            new CreateMapAreaPointDto { X = 20, Y = 20, Order = 2 },
        };

        var result = _areaValidator.Validate(area);

        Assert.Contains(
            result.Errors,
            error => error.PropertyName.EndsWith(
                nameof(CreateMapAreaPointDto.Order),
                StringComparison.Ordinal));
    }

    [Fact]
    public void ValidateCommand_WhenAreaIsNull_ShouldFail()
    {
        var result = _commandValidator.Validate(new CreateMapAreaCommand(null!));

        Assert.Contains(
            result.Errors,
            error => error.PropertyName == nameof(CreateMapAreaCommand.Area));
    }

    private static CreateMapAreaDto CreateValidArea()
    {
        return new CreateMapAreaDto
        {
            Name = "Test area",
            Description = "Area used by unit tests.",
            Color = "#2563eb",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
                new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
                new CreateMapAreaPointDto { X = 20, Y = 20, Order = 2 },
            },
        };
    }
}
