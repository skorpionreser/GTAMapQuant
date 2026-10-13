using FluentValidation;
using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.BLL.MediatR.MapModes.CreateMapMode;

namespace GTAMapQuant.BLL.MediatR.MapModes.Validators;

public sealed class CreateMapModeCommandValidator
    : AbstractValidator<CreateMapModeCommand>
{
    public CreateMapModeCommandValidator(
        IValidator<CreateMapModeDto> modeValidator)
    {
        RuleFor(command => command.Mode)
            .NotNull()
            .WithMessage("Mode is required.")
            .SetValidator(modeValidator);
    }
}
