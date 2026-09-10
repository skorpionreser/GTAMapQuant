using FluentValidation;
using GTAMapQuant.BLL.DTO.MapMarkers;

namespace GTAMapQuant.BLL.MediatR.MapMarkers.Validators;

public sealed class UpdateMapMarkerDtoValidator
    : AbstractValidator<UpdateMapMarkerDto>
{
    public UpdateMapMarkerDtoValidator()
    {
        RuleFor(marker => marker.Name)
            .NotEmpty()
            .WithMessage("Name is required.");

        RuleFor(marker => marker.Category)
            .IsInEnum()
            .WithMessage("Category is invalid.");

        RuleFor(marker => marker.X)
            .Must(value => double.IsFinite(value))
            .WithMessage("X must be a finite number.");

        RuleFor(marker => marker.Y)
            .Must(value => double.IsFinite(value))
            .WithMessage("Y must be a finite number.");
    }
}