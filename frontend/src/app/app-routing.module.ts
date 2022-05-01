import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OutOfStockComponent } from './components/cart/out-of-stock.component';
import { SuccessfulPaymentComponent } from './components/cart/successful-payment.component';
import { CartComponent } from './components/cart/cart.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { UserProfileComponent } from './components/userProfile.component';
import { AdminHomeComponent } from './components/adminHome.component';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index.component';
import { LoginComponent } from './components/login.component';
import { AboutComponent } from './components/about.component';
import { ManageUsersComponent } from './components/manageUsers.component';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

const routes: Routes = [

  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'about', component: AboutComponent},
  {path: 'admin/home', component: AdminHomeComponent},
  {path: 'userProfile', component: UserProfileComponent},
  {path: 'admin/manageUsers', component: ManageUsersComponent},

  // TRANSACTIONS

  {path: 'cart', component: CartComponent},
  {path: 'successfulPayment', component: SuccessfulPaymentComponent},
  {path: 'outOfStock/:id', component: OutOfStockComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'purchaseHistory', component: PurchaseHistoryComponent}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
