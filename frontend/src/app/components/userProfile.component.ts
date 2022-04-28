import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'userProfile',
  templateUrl: './userProfile.component.html'
})

export class UserProfileComponent{


  user!: User;
  oldPass: string;
  newPass: string;
  newConfPass: string;

  constructor(private httpClient: HttpClient, public loginService: LoginService) {
    this.oldPass="";
    this.newPass="";
    this.newConfPass="";
    this.httpClient.get('/api/users/me', { withCredentials: true }).subscribe(
      response => {
          this.user = response as User;
      },
      error => {

          if (error.status != 404) {
              console.error('Error when asking if logged: ' + JSON.stringify(error));
          }

      }
  );
   }

  updateInfo(){

    let data = { id: "",
                username: "",
                password: "",
                email: this.user.email,
                name: this.user.name,
                lastName: this.user.lastName,
                address: this.user.address,
                mobileNumber: this.user.mobileNumber,
                birthdate: this.user.birthdate,
                role: ""};
    this.httpClient.put("/api/users/userInfo", data).subscribe(
    response => console.log(response),
    error => console.error(error)
    );
  }

  updatePass(){
    let data = {
      oldPass: this.oldPass,
      newPass: this.newPass,
      newConfPass: this.newConfPass

    };
    this.httpClient.put("/api/users/password", data).subscribe(
      response => console.log(response),
      error => console.error(error)
      );
  }

  openFormChangePassword(){

    const element = <HTMLElement> document.getElementById("change-password-form");

    element.style.display = "block"
  }

  closeFormChangePassword(){
    const element = <HTMLElement> document.getElementById("change-password-form");

    element.style.display = "none"
  }

}
