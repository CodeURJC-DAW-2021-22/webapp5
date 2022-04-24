import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index.component';
import { LoginComponent } from './login.component';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
