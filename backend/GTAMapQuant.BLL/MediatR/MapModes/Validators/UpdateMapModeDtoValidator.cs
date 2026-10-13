using FluentValidation;
using GTAMapQuant.BLL.DTO.MapModes;

namespace GTAMapQuant.BLL.MediatR.MapModes.Validators;

public sealed class UpdateMapModeDtoValidator
    : AbstractValidator<UpdateMapModeDto>
{
    public UpdateMapModeDtoValidator()
    {
        RuleFor(mode => mode.Name)
            .Must(name => !string.IsNullOrWhiteSpace(name))
            .WithMessage("Name cannot be empty or whitespace.");

        RuleFor(mode => mode.MapAreaIds)
            .Cascade(CascadeMode.Stop)
            .NotNull()
            .WithMessage("MapAreaIds cannot be null.")
            .Must(ids => ids.All(id => id != Guid.Empty))
            .WithMessage("MapAreaIds cannot contain empty GUIDs.")
            .Must(ids => ids.Distinct().Count() == ids.Count)
            .WithMessage("MapAreaIds cannot contain duplicate values.");

        RuleFor(mode => mode.MapMarkerIds)
            .Cascade(CascadeMode.Stop)
            .NotNull()
            .WithMessage("MapMarkerIds cannot be null.")
            .Must(ids => ids.All(id => id != Guid.Empty))
            .WithMessage("MapMarkerIds cannot contain empty GUIDs.")
            .Must(ids => ids.Distinct().Count() == ids.Count)
            .WithMessage("MapMarkerIds cannot contain duplicate values.");
    }
}
