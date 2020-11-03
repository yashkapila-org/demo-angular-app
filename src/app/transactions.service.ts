import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import transactionsMock from '../mocks/transactions.json';

export interface ITransaction {
  categoryCode: string;
  dates: {
    valueDate: string | number;
  };
  transaction: {
    amountCurrency: {
      amount: string | number;
      currencyCode: string;
    };
    type: string;
    creditDebitIndicator: 'CRDT' | 'DBIT';
  };
  merchant: {
    name: string;
    accountNumber: string;
  };
}

const DELAY_MS = 500;

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  list: Array<ITransaction> = transactionsMock.data as any;

  constructor(
    private store: Store<{ transactions: any }>
  ) {}

  getList(): Observable<Array<ITransaction>> {
    return of(this.list).pipe(delay(DELAY_MS));
  }

  addTransaction(newTransaction: ITransaction): void {
    this.list = [newTransaction, ...this.list];
  }
}
