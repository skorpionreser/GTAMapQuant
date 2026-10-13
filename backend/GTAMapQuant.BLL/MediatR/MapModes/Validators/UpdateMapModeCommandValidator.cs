using FluentValidation;
using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.BLL.MediatR.MapModes.UpdateMapMode;

namespace GTAMapQuant.BLL.MediatR.MapModes.Validators;

public sealed class UpdateMapModeCommandValidator
    : AbstractValidator<UpdateMapModeCommand>
{
    public UpdateMapModeCommandValidator(IValidator<UpdateMapModeDto> modeValidator)
    {
        RuleFor(command => command.Mode)
            .NotNull()
            .WithMessage("Mode is required.")
            .SetValidator(modeValidator);
    }
}
