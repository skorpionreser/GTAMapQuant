using FluentValidation;
using GTAMapQuant.BLL.DTO.MapAreas;

namespace GTAMapQuant.BLL.MediatR.MapAreas.Validators;

public sealed class CreateMapAreaDtoValidator
    : AbstractValidator<CreateMapAreaDto>
{
    public CreateMapAreaDtoValidator(
        IValidator<CreateMapAreaPointDto> pointValidator)
    {
        RuleFor(area => area.Name)
            .NotEmpty()
            .WithMessage("Name is required.");

        RuleFor(area => area.Color)
            .NotEmpty()
            .WithMessage("Color is required.")
            .Matches("^#[0-9A-Fa-f]{6}$")
            .WithMessage("Color must be a hex color in #RRGGBB format.");

        RuleFor(area => area.Points)
            .NotNull()
            .WithMessage("Points are required.")
            .Must(points => points.Count() >= 3)
            .WithMessage("Area must contain at least 3 points.")
            .Must(points => points.Select(point => point.Order).Distinct().Count() == points.Count())
            .WithMessage("Point order values must be unique.");

        RuleForEach(area => area.Points)
            .SetValidator(pointValidator);
    }
}
