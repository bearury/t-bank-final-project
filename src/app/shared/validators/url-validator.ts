import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function urlValidator(): ValidatorFn {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !urlPattern.test(control.value)) {
      return { invalidUrl: true };
    }
    return null;
  };
}
