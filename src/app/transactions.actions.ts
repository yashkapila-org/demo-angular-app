import { createAction, props } from '@ngrx/store';
import { ITransaction } from './transactions.service';

export const loadAction = createAction('[Transactions] Load');
export const successAction = createAction(
  '[Transactions] Load success',
  props<{ transactionsList: Array<ITransaction> }>()
);
export const errorAction = createAction('[Transactions] Load error');
