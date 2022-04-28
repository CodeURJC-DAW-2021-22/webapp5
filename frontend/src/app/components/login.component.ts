import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { User } from '../models/user.model';
import { LoginService } from '../services/login.service';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})


export class LoginComponent {

  constructor(public loginService: LoginService) {

  }

  logIn(event: any, user: string, pass: string) {

    event.preventDefault();

    this.loginService.logIn(user, pass);
  }

  logOut() {
    this.loginService.logOut();
  }

  register(username: string, email: string, number:string, password: string, confpassword: string){
      if(password.match(confpassword)){
        let data = { id: "",
                  username: username,
                  password: password,
                  email: email,
                  name: "",
                  lastName: "",
                  address: "",
                  mobileNumber:number,
                  birthdate: "",
                  role: "USER"};
        this.loginService.register(data);
      }else{
        console.log("error");
      }

  }

}
