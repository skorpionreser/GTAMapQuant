using FluentValidation;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.UpdateMapMarker;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.Validators;

public sealed class UpdateMapMarkerCommandValidator
    : AbstractValidator<UpdateMapMarkerCommand>
{
    public UpdateMapMarkerCommandValidator(
        IValidator<UpdateMapMarkerDto> markerValidator)
    {
        RuleFor(command => command.Id)
            .NotEmpty()
            .WithMessage("Marker id is required.");

        RuleFor(command => command.Marker)
            .NotNull()
            .WithMessage("Marker is required.")
            .SetValidator(markerValidator);
    }
}