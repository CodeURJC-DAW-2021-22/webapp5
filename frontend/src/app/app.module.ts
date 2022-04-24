import { LoginComponent } from './login.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './index.component';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, FooterComponent, IndexComponent, LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
