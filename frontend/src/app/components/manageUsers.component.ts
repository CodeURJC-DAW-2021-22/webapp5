import { HttpClient } from '@angular/common/http';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'manageUsers',
  templateUrl: './manageUsers.component.html'
})

export class ManageUsersComponent{


  users!: User[];
  id!:number;
  username!: string;
  password!: string;
  email!: string;
  name!: string;
  lastName!: string;
  address!: string;
  mobileNumber!: number;
  birthdate!: string;
  role!: string;
  event: string;



  constructor(private httpClient: HttpClient, public loginService: LoginService, public userService: UserService, public router: Router) {

    this.event="";

    this.userService.getUserLogged().subscribe(
      error => console.log("error")//this.router.navigate(['/login'])
    );

    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => console.error(error)
    );

   }


   deleteUser(id?: number){
    this.userService.deleteUser(id!).subscribe(
      user => console.log(user),
      error => console.error(error)
    );
   }


    editUserLoad(id?: number){
      var element = <HTMLElement> document.getElementById("modalAddEditUserData");

      element.style.display = "block";
      element.classList.remove("fade");

      this.event="update";
      this.id=id!-1;
      this.username = this.users[id!-1].username;
      this.email= this.users[id!-1].email;
      this.name= this.users[id!-1].name;
      this.lastName= this.users[id!-1].lastName;
      this.address= this.users[id!-1].address;
      this.mobileNumber= this.users[id!-1].mobileNumber;
      this.birthdate = this.users[id!-1].birthdate;
      this.password = "";
      this.role= this.users[id!-1].role;

    };

    addUserLoad(){
      this.event="add";
      var element = <HTMLElement> document.getElementById("modalAddEditUserData");

      element.style.display = "block";
      element.classList.remove("fade");

      this.username = "";
      this.email="";
      this.name= "";
      this.lastName= "";
      this.address="";
      this.mobileNumber= 0;
      this.birthdate = "";
      this.password = "";
      this.role= "";


    }

    done(){

      var data = {
        id: this.id,
        username: this.username,
        password: this.password,
        email:  this.email,
        name: this.name,
        lastName: this.lastName,
        address: this.address,
        mobileNumber: this.mobileNumber,
        birthdate: this.birthdate,
        role: this.role
      };

      if(this.event.match("update")){

        this.userService.updateUserAdmin(data).subscribe(
          user => console.log(user),
          error => console.error(error)
        );

      }else{
        this.userService.addUser(data).subscribe(
          user => console.log(user),
          error => console.error(error)
        );
      }

    }

    close(){
      const element = <HTMLElement> document.getElementById("modalAddEditUserData");

      element.style.display = "none";
      element.classList.add("fade");

    }


}
