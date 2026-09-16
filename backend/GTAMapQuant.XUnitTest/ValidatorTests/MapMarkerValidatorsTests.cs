using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.CreateMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.DeleteMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.UpdateMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.Validators;
using GTAMapQuant.DAL.Entities;
using Xunit;

namespace GTAMapQuant.XUnitTest.ValidatorTests;

public class MapMarkerValidatorsTests
{
    private readonly CreateMapMarkerDtoValidator _createDtoValidator = new();
    private readonly UpdateMapMarkerDtoValidator _updateDtoValidator = new();

    [Fact]
    public void ValidateCreate_WhenMarkerIsValid_ShouldSucceed()
    {
        var result = _createDtoValidator.Validate(CreateValidMarker());

        Assert.True(result.IsValid);
    }

    [Fact]
    public void ValidateCreate_WhenNameIsEmpty_ShouldFail()
    {
        var marker = CreateValidMarker();
        marker.Name = string.Empty;

        var result = _createDtoValidator.Validate(marker);

        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CreateMapMarkerDto.Name));
    }

    [Fact]
    public void ValidateCreate_WhenCoordinateIsNotFinite_ShouldFail()
    {
        var marker = CreateValidMarker();
        marker.X = double.NaN;

        var result = _createDtoValidator.Validate(marker);

        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CreateMapMarkerDto.X));
    }

    [Fact]
    public void ValidateUpdate_WhenCategoryIsInvalid_ShouldFail()
    {
        var marker = new UpdateMapMarkerDto
        {
            Name = "Invalid category",
            Category = (MarkerCategory)99,
            X = 10,
            Y = 20,
        };

        var result = _updateDtoValidator.Validate(marker);

        Assert.Contains(result.Errors, error => error.PropertyName == nameof(UpdateMapMarkerDto.Category));
    }

    [Fact]
    public void ValidateCreateCommand_WhenMarkerIsNull_ShouldFail()
    {
        var validator = new CreateMapMarkerCommandValidator(_createDtoValidator);

        var result = validator.Validate(new CreateMapMarkerCommand(null!));

        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CreateMapMarkerCommand.Marker));
    }

    [Fact]
    public void ValidateUpdateCommand_WhenIdIsEmptyOrMarkerIsInvalid_ShouldFail()
    {
        var validator = new UpdateMapMarkerCommandValidator(_updateDtoValidator);
        var marker = new UpdateMapMarkerDto
        {
            Name = string.Empty,
            Category = MarkerCategory.Shop,
            X = 10,
            Y = 20,
        };

        var result = validator.Validate(new UpdateMapMarkerCommand(Guid.Empty, marker));

        Assert.Contains(result.Errors, error => error.PropertyName == nameof(UpdateMapMarkerCommand.Id));
        Assert.Contains(result.Errors, error => error.PropertyName.EndsWith(nameof(UpdateMapMarkerDto.Name), StringComparison.Ordinal));
    }

    [Fact]
    public void ValidateDeleteCommand_WhenIdIsEmpty_ShouldFail()
    {
        var validator = new DeleteMapMarkerCommandValidator();

        var result = validator.Validate(new DeleteMapMarkerCommand(Guid.Empty));

        Assert.Contains(result.Errors, error => error.PropertyName == nameof(DeleteMapMarkerCommand.Id));
    }

    private static CreateMapMarkerDto CreateValidMarker()
    {
        return new CreateMapMarkerDto
        {
            Name = "Ammu-Nation",
            Description = "Test marker.",
            Category = MarkerCategory.Shop,
            X = 10,
            Y = 20,
        };
    }
}
