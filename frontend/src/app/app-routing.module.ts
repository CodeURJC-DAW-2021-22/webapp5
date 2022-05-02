import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/products/index.component';
import { LoginComponent } from './components/login.component';
import { AboutComponent } from './components/about.component';
import { ProductViewComponent } from './components/products/productView.component';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'about', component: AboutComponent},
  {path: 'productView/:id', component: ProductViewComponent}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
