using FluentValidation;
using GTAMapQuant.BLL.DTO.MapAreas;

namespace GTAMapQuant.BLL.MediatR.MapAreas.Validators;

public sealed class CreateMapAreaPointDtoValidator
    : AbstractValidator<CreateMapAreaPointDto>
{
    public CreateMapAreaPointDtoValidator()
    {
        RuleFor(point => point.X)
            .Must(value => double.IsFinite(value))
            .WithMessage("X must be a finite number.");

        RuleFor(point => point.Y)
            .Must(value => double.IsFinite(value))
            .WithMessage("Y must be a finite number.");

        RuleFor(point => point.Order)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Order must be greater than or equal to 0.");
    }
}
