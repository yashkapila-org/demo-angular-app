import * as iban from 'iban';
import { AbstractControl } from '@angular/forms';

export function ibanValidator(control: AbstractControl): {[key: string]: boolean} | null {
  if (!iban.isValid(control.value)){
    return { iban: true };
  }
  return null;
}
