using FluentValidation;
using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.BLL.MediatR.MapAreas.UpdateMapArea;

namespace GTAMapQuant.BLL.MediatR.MapAreas.Validators;

public sealed class UpdateMapAreaCommandValidator
    : AbstractValidator<UpdateMapAreaCommand>
{
    public UpdateMapAreaCommandValidator(
        IValidator<UpdateMapAreaDto> areaValidator)
    {
        RuleFor(command => command.Area)
            .NotNull()
            .WithMessage("Area is required.")
            .SetValidator(areaValidator);
    }
}
