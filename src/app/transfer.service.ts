import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TransactionsService } from './transactions.service';
import { successAction } from './transfer.actions';

export interface IAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  maxOverdraft: number;
}

interface ITransfer {
  amount: number;
  fromAccount: IAccount;
}

const DELAY_MS = 200;

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  accounts = [{
    id: '1',
    name: 'Free Checking (4692)',
    balance: 5824.76,
    currency: 'USD',
    maxOverdraft: 500
  }];

  constructor(
    private transactionsService: TransactionsService,
    private store: Store<{ transactions: any }>
  ) {}

  getFromAccounts(): Observable<Array<IAccount>> {
    return of(this.accounts).pipe(delay(DELAY_MS));
  }

  makeTransfer(newTransfer: ITransfer): Observable<null> {
    return of(null)
      .pipe(
        delay(DELAY_MS),
        tap(() => {
          const account = this.accounts.find(acc => acc.id === newTransfer.fromAccount.id);
          if (!account) {
            throw Error('account not found');
          }
          account.balance -= newTransfer.amount;
          account.balance = Math.round(account.balance * 100) / 100;

          this.transactionsService.addTransaction({
            categoryCode: '#1180aa',
            dates: {
              valueDate: Date.now()
            },
            transaction: {
              amountCurrency: {
                amount: newTransfer.amount,
                currencyCode: newTransfer.fromAccount.currency,
              },
              type: 'Transaction',
              creditDebitIndicator: 'DBIT'
            },
            merchant: {
              name: '',
              accountNumber: ''
            }
          });

          this.store.dispatch(successAction());
        })
      );
  }
}
