import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { ITransaction } from '../transactions.service';
import { loadAction } from '../transactions.actions';

type SortByOption = 'amount' | 'beneficiary' | 'date';

interface ITransactionRow {
  date: number;
  merchantIconSrc: string;
  merchantName: string;
  transactionType: string;
  amount: number;
  currency: string;
  categoryCode: string;
}

function normalizeTransaction(transaction: ITransaction): ITransactionRow {
  let date: string | number = transaction.dates.valueDate;
  if (typeof date === 'string') {
    date = new Date(date).getTime();
  }
  let amount: string | number = transaction.transaction.amountCurrency.amount;
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  if (transaction.transaction.creditDebitIndicator === 'DBIT') {
    amount = -amount;
  }
  const merchantIconSrc = transaction.merchant.name
    ? 'assets/merchant-logos/' + transaction.merchant.name.toLowerCase().split(' ').join('-') + '.png'
    : null;
  return {
    date,
    merchantIconSrc,
    merchantName: transaction.merchant.name,
    transactionType: transaction.transaction.type,
    amount,
    currency: transaction.transaction.amountCurrency.currencyCode,
    categoryCode: transaction.categoryCode,
  };
}

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html'
})
export class TransactionsListComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  isLoading = false;
  transactions: Array<ITransactionRow> = [];

  fcSearchPhrase = new FormControl('');

  sort$ = new BehaviorSubject<{
    sortBy: SortByOption,
    isAscending: boolean
  }>({
    sortBy: 'date',
    isAscending: false
  });
  // properties for easier handling in the template:
  sortBy: SortByOption;
  isAscending: boolean;

  constructor(
    private store: Store<{ transactions: any }>
  ) {}

  ngOnInit(): void {
    const normalizedTransactionsState$ = this.store.pipe(
      select('transactions'),
      map(transactionsState => ({
        isLoading: transactionsState.isLoading,
        list: transactionsState.list.map(normalizeTransaction)
      }))
    );
    const searchPhrase$ = this.fcSearchPhrase.valueChanges.pipe(startWith(''));
    this.subscription = combineLatest([
      normalizedTransactionsState$,
      searchPhrase$,
      this.sort$
    ])
      .subscribe(([transactionsState, searchPhrase, sort]) => {
        this.isLoading = transactionsState.isLoading;
        // Search
        const lowerCaseSearchPhrase = searchPhrase.toLowerCase();
        this.transactions = transactionsState.list.filter(
          transaction => {
            const phrases = [
              transaction.transactionType,
              transaction.merchantName,
              transaction.currency
            ];
            for (const phrase of phrases) {
              if (phrase.toLowerCase().indexOf(lowerCaseSearchPhrase) >= 0) {
                return true;
              }
            }
            return false;
          }
        );
        // Sort
        this.sortBy = sort.sortBy;
        this.isAscending = sort.isAscending;
        const sortOrderMultiplier = sort.isAscending ? 1 : -1;
        const sortFnDict = {
          amount: (a: ITransactionRow, b: ITransactionRow) => (a.amount - b.amount) * sortOrderMultiplier,
          beneficiary: (a: ITransactionRow, b: ITransactionRow) => (a.merchantName > b.merchantName ? 1 : -1) * sortOrderMultiplier,
          date: (a: ITransactionRow, b: ITransactionRow) => (a.date - b.date) * sortOrderMultiplier
        };
        const sortFn = sortFnDict[sort.sortBy];
        if (sortFn) {
          this.transactions.sort(sortFn);
        }
      });

    this.store.dispatch(loadAction());
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setSortBy(sortBy: SortByOption): void {
    const currentSort = this.sort$.getValue();
    this.sort$.next({
      sortBy,
      isAscending: sortBy === currentSort.sortBy ? !currentSort.isAscending : currentSort.isAscending
    });
  }
}
