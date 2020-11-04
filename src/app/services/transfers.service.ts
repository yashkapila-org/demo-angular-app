import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Account } from '../models/account.model';

const myAccount = {
  name: 'My Personal Account',
  currentBalance: 5824.76
};

@Injectable({
  providedIn: 'root'
})
export class TransfersService {
  private myAccount$: BehaviorSubject<Account> = new BehaviorSubject(myAccount);

  constructor() {

  }

   getMyAccount(): BehaviorSubject<Account> {
     return this.myAccount$;
   }

   setMyAccount(data: Account): void {
     this.myAccount$.next(data);
   }
}
