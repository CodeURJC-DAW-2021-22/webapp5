import { OutOfStockComponent } from './components/cart/out-of-stock.component';
import { SuccessfulPaymentComponent } from './components/cart/successful-payment.component';
import { ManageUsersComponent } from './components/manageUsers.component';
import { UserProfileComponent } from './components/userProfile.component';
import { AdminHomeComponent } from './components/adminHome.component';
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

import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { ManageProductsComponent } from './components/manageProducts.component';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, AdminHeaderComponent, FooterComponent, IndexComponent, LoginComponent, 
    AboutComponent, ProductsListComponent, ProductViewComponent, CartComponent, SuccessfulPaymentComponent, OutOfStockComponent, WishlistComponent, 
    PurchaseHistoryComponent, AdminHomeComponent, UserProfileComponent, ManageUsersComponent, ManageProductsComponent
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
