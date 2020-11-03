import { AbstractControl, ValidatorFn } from '@angular/forms';

export function createAmountValidator(maxAmountGetterFn: () => number): ValidatorFn {
  return function amountValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const amountString = control.value;
    const amount = parseFloat(amountString);
    if (isNaN(amount)) {
      return { invalid: true };
    }
    if (amount <= 0) {
      return { amountTooLow: true };
    }
    if (amount > maxAmountGetterFn()) {
      return { amountTooHigh: true };
    }
    return null;
  };
}
