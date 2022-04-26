import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginService } from '../services/login.service';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})


export class LoginComponent {
  constructor(public loginService: LoginService) { }

  logIn(event: any, user: string, pass: string) {

    event.preventDefault();

    this.loginService.logIn(user, pass);
  }

  logOut() {
    this.loginService.logOut();
  }
}
