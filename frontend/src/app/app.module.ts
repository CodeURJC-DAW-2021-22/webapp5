import { LoginComponent } from './components/login.component';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './components/products/index.component';
import { ProductsListComponent } from './components/products/productsList.component';
import { AdminHeaderComponent } from './components/adminHeader.component';
import { AboutComponent } from './components/about.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductViewComponent } from './components/products/productView.component';


schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, AdminHeaderComponent, FooterComponent, IndexComponent, LoginComponent, 
    AboutComponent, ProductsListComponent, ProductViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
