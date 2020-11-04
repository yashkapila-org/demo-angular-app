import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LogoComponent } from './bb-ui/components/logo/logo.component';
import { FooterComponent } from './bb-ui/components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { HeaderComponent } from './components/header/header.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { TransfersListComponent } from './components/transfers-list/transfers-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SubmitButtonComponent } from './bb-ui/components/submit-button/submit-button.component';

import { TransfersService } from './services/transfers.service';

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    FooterComponent,
    ContentComponent,
    HeaderComponent,
    TransferComponent,
    TransfersListComponent,
    SubmitButtonComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [TransfersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
