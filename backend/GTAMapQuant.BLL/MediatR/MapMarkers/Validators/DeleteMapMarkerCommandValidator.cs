using FluentValidation;
using GTAMapQuant.BLL.MediatR.MapMarkers.DeleteMapMarker;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.Validators;

public sealed class DeleteMapMarkerCommandValidator
    : AbstractValidator<DeleteMapMarkerCommand>
{
    public DeleteMapMarkerCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty()
            .WithMessage("Marker id is required.");
    }
}