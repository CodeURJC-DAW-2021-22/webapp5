import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

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


  constructor(private httpClient: HttpClient, public loginService: LoginService, public userService: UserService, public router: Router) {
    this.oldPass="";
    this.newPass="";
    this.newConfPass="";
    this.userService.getUserLogged().subscribe(
      user => this.user= user,
      error => console.log("error")//this.router.navigate(['/login'])
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
                role: ""
    };

    this.userService.updateUser(data).subscribe(
      user => console.log(user),
      error => console.error(error)
    );

  }

  updatePass(){
    let data = {
      oldPass: this.oldPass,
      newPass: this.newPass,
      newConfPass: this.newConfPass
    };

    this.userService.updatePass(data).subscribe(
      user => console.log(user),
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
