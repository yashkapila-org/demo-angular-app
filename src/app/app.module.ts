import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// In a larger applications translations would be loaded dynamically.
// This app doesn't use http.
import translationEnUS from '../i18n/en-US.json';
import translationPlPL from '../i18n/pl-PL.json';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { transactionsReducer } from './transactions.reducer';
import { TransactionsEffects } from './transactions.effects';

import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { TransferFormComponent } from './transfer-form/transfer-form.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    TransactionsListComponent,
    TransferFormComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en-US',
      loader: {
        provide: TranslateLoader,
        useFactory: () => ({
          getTranslation: (lang: string): Observable<any> => {
            return of({
              'en-US': translationEnUS,
              'pl-PL': translationPlPL
            }[lang]);
          }
        })
      }
  }),
    StoreModule.forRoot({
      transactions: transactionsReducer
    }),
    EffectsModule.forRoot([
      TransactionsEffects
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
