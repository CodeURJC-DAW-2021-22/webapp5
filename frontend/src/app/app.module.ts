import { LoginComponent } from './components/login.component';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './components/index.component';
import { AdminHeaderComponent } from './components/adminHeader.component';
import { AboutComponent } from './components/about.component';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, AdminHeaderComponent, FooterComponent, IndexComponent, LoginComponent, AboutComponent
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
