import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})


export class LoginComponent {

  constructor(public loginService: LoginService, public userService: UserService, private router: Router) {
    this.userService.getUserLogged().subscribe({
      next: _ => this.router.navigate(['/'])
    });
  }

  logIn(event: any, user: string, pass: string) {

    event.preventDefault();

    this.loginService.logIn(user, pass);
  }

  logOut() {
    this.loginService.logOut();
  }

  register(username: string, email: string, mobileNumber:string, password: string, confpassword: string){
      if(password.match(confpassword)){
        let data = { id: "",
                  username: username,
                  password: password,
                  email: email,
                  name: "",
                  lastName: "",
                  address: "",
                  mobileNumber:mobileNumber,
                  birthdate: "",
                  role: "USER"};
        this.userService.register(data).subscribe(
          user => this.loginService.logIn(data.username,data.password),
          error => console.error(error)
        );
      }else{
        console.log("error");
      }

  }

}
