import { UserProfileComponent } from './components/userProfile.component';
import { AdminHomeComponent } from './components/adminHome.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index.component';
import { LoginComponent } from './components/login.component';
import { AboutComponent } from './components/about.component';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'about', component: AboutComponent},
  {path: 'admin/home', component: AdminHomeComponent},
  {path: 'userProfile', component: UserProfileComponent}];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
