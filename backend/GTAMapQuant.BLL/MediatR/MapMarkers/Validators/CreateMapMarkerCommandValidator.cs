using FluentValidation;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.CreateMapMarker;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.Validators;

public sealed class CreateMapMarkerCommandValidator
    : AbstractValidator<CreateMapMarkerCommand>
{
    public CreateMapMarkerCommandValidator(
        IValidator<CreateMapMarkerDto> markerValidator)
    {
        RuleFor(command => command.Marker)
            .NotNull()
            .WithMessage("Marker is required.")
            .SetValidator(markerValidator);
    }
}