import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransferService, IAccount } from '../transfer.service';
import { createAmountValidator } from './amount.validator';
import { ibanValidator } from './iban.validator';

// Separate configurations for fields are not needed here.
const transferFormErrorsOrder = ['required', 'iban', 'invalid', 'amountTooLow'];

const transferFormInitialValues = {
  fromAccount: '',
  toAccount: '',
  amount: '',
};

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html'
})
export class TransferFormComponent implements OnInit {
  currentState: 'FORM' | 'CONFIRMATION' = 'FORM';

  fromAccount?: IAccount = null;

  // show loading indicator for account field
  isLoadingAccounts = false;

  // show loading indicator after form is submitted
  isLoading = false;

  // show form submitting error
  isError = false;

  fcFromAccount = new FormControl({ value: '', disabled: true });
  fcToAccount = new FormControl('', [
    Validators.required,
    ibanValidator
  ]);
  fcAmount = new FormControl('', [
    Validators.required,
    createAmountValidator(() => {
      if (!this.fromAccount) {
        return 0;
      }
      return this.fromAccount.balance + this.fromAccount.maxOverdraft;
    })
  ]);
  transferForm = new FormGroup({
    fromAccount: this.fcFromAccount,
    toAccount: this.fcToAccount,
    amount: this.fcAmount,
  });

  confirmationSummary = {
    fromAccount: '',
    toAccount: '',
    amount: '', // 6301
    currency: ''
  };

  constructor(
    private transferService: TransferService
  ) {}

  ngOnInit(): void {
    this.showForm();
  }

  showForm(): void {
    this.currentState = 'FORM';
    this.transferForm.reset();
    this.transferForm.setValue(transferFormInitialValues);

    this.isLoadingAccounts = true;
    this.transferService.getFromAccounts().subscribe(fromAccounts => {
      this.fromAccount = fromAccounts[0];
      this.isLoadingAccounts = false;
      if (this.fromAccount) {
        const displayValue = this.fromAccount.name + ' - ' + this.fromAccount.balance + ' ' + this.fromAccount.currency;
        this.fcFromAccount.setValue(displayValue);
      } else {
        this.fcFromAccount.setValue('');
      }
    });
  }

  showConfirmation(): void {
    this.confirmationSummary = {
      fromAccount: this.fcFromAccount.value,
      toAccount: this.fcToAccount.value,
      amount: parseFloat(this.fcAmount.value).toFixed(2),
      currency: this.fromAccount.currency
    };
    this.currentState = 'CONFIRMATION';
  }

  onSubmit(): void {
    // Prevent multiple clicks
    if (this.isLoading) {
      return;
    }
    // Check if all data is loaded
    if (this.isLoadingAccounts) {
      return;
    }
    // Show all errors
    Object.keys(this.transferForm.controls).forEach(key => {
      this.transferForm.controls[key].markAsDirty();
    });
    // Prevent sending invalid form
    if (this.transferForm.invalid) {
      return;
    }
    this.showConfirmation();
  }

  onBack(): void {
    // Prevent going back when request is in progress
    if (this.isLoading) {
      return;
    }
    this.currentState = 'FORM';
  }

  onConfirm(): void {
    // Prevent multiple clicks
    if (this.isLoading) {
      return;
    }
    // Map form to transfer DTO
    const transfer = {
      amount: parseFloat(this.transferForm.value.amount),
      fromAccount: this.fromAccount
    };
    // Submit
    this.isError = false;
    this.isLoading = true;
    this.transferService
      .makeTransfer(transfer)
      .subscribe(
        () => {
          this.isLoading = false;
          this.showForm();
        },
        () => {
          // Show generic error
          this.isError = true;
          this.isLoading = false;
        }
      );
  }

  getFirstError(formControl: FormControl): string | undefined {
    const errorKey = transferFormErrorsOrder.find(key => formControl.errors[key]);
    return errorKey || Object.keys(formControl.errors)[0];
  }
}
