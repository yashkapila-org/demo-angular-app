import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { successAction as transferSuccessAction } from './transfer.actions';
import { loadAction, successAction, errorAction } from './transactions.actions';
import { TransactionsService } from './transactions.service';

@Injectable()
export class TransactionsEffects {
  constructor(
    private actions$: Actions,
    private transactionsService: TransactionsService
  ) {}

  loadTransactions$ = createEffect(() => this.actions$.pipe(
    ofType(loadAction.type),
    // ignore previous pending requests to prevent wrong order
    switchMap(() => this.transactionsService.getList()
      .pipe(
        map(transactionsList => successAction({ transactionsList })),
        catchError(() => of(errorAction()))
      )
    )
  ));

  /* Reload transactions list after a transfer is made */
  transferSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(transferSuccessAction.type),
    map(() => loadAction())
  ));
}
