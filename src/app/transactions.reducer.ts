import { createReducer, on } from '@ngrx/store';
import { errorAction, loadAction, successAction } from './transactions.actions';
import { ITransaction } from './transactions.service';

export interface ITransactionsState {
  isLoading: boolean;
  isError: boolean;
  list: ITransaction[];
}

const initialState: ITransactionsState = {
  isLoading: false,
  isError: false,
  list: []
};

const reducer = createReducer(initialState,
  on(loadAction, (state) => ({
    ...state,
    isLoading: true,
    isError: false
  })),
  on(successAction, (state, { transactionsList }) => ({
    ...state,
    isLoading: false,
    list: transactionsList
  })),
  on(errorAction, (state) => ({
    ...state,
    isLoading: false,
    isError: true
  })),
);

export function transactionsReducer(state, action): ITransactionsState {
  return reducer(state, action);
}
