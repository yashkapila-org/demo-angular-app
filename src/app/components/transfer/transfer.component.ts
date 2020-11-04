import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TransfersService } from 'src/app/services/transfers.service';

import { Account } from '../../models/account.model';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  transferForm = new FormGroup({
    fromAccount: new FormControl({ value: '', disabled: true }),
    toAccount: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, this.isANumber, this.isValidAmount.bind(this)])
  });

  myAccount$: BehaviorSubject<Account> = this.tranfersService.getMyAccount();

  currentBalance: number;

  constructor(private tranfersService: TransfersService) { }

  ngOnInit(): void {
    this.myAccount$.subscribe((account) => {
      const value = { fromAccount: `${account.name} - €${account.currentBalance}` };
      this.transferForm.patchValue(value);

      this.currentBalance = account.currentBalance;
    });
  }

  submitForm(event: Event): void {
    if (this.transferForm.valid) {
      console.log('form submitted...');
    } else {
      this.validateAllFormFields(this.transferForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isValidAmount(control: AbstractControl): { [key: string]: any } | null {
    if ( !control.value.match('^[0-9]*$')) {
      return null;
    }
    const forbidden = (this.currentBalance + 500) > control.value ? true : false;
    return forbidden ? null : { lowBalance: true };
  }

  isANumber(control: AbstractControl): { [key: string]: any } | null {
    const valid = control.value.match('^[0-9]*$');
    return valid ? null : { notANumber: true };
  }

  get amount() { return this.transferForm.get('amount'); }

}
