using FluentValidation;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.BLL.MediatR.MapAreas.CreateMapArea;

namespace GTAMapQuant.BLL.MediatR.MapAreas.Validators;

public sealed class CreateMapAreaCommandValidator
    : AbstractValidator<CreateMapAreaCommand>
{
    public CreateMapAreaCommandValidator(
        IValidator<CreateMapAreaDto> areaValidator)
    {
        RuleFor(command => command.Area)
            .NotNull()
            .WithMessage("Area is required.")
            .SetValidator(areaValidator);
    }
}
