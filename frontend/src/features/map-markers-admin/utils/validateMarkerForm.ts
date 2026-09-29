import type { MarkerFormErrors } from "../types/MarkerFormErrors";
import type { MarkerFormValues } from "../types/MarkerFormValues";

export function validateMarkerForm(values: MarkerFormValues): MarkerFormErrors {
    const errors: MarkerFormErrors = {};

    if (values.name.trim() === '') {
        errors.name = 'Name is required.'
    }
    if (values.x.trim() === '' || !Number.isFinite(Number(values.x))) {
        errors.x = 'X must be a finite number.'
    }
    if (values.y.trim() === '' || !Number.isFinite(Number(values.y))) {
        errors.y = 'Y must be a finite number.'
    }

    return errors
}