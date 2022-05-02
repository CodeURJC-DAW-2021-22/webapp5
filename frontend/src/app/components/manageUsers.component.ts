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
  phoneNumber!: number;
  birthDate!: string;
  role!: string;
  event: string;

  currentPage: number=1;
  maxPages: number=1;

  constructor(private httpClient: HttpClient, public loginService: LoginService, public userService: UserService, public router: Router) {

    this.event="";

    this.userService.getUserLogged().subscribe(
      user => {},
      error => console.error(error)
    );

    this.httpClient.get("/api/users/maxPages", {withCredentials: true}).subscribe({
      next: maxPages => this.maxPages = maxPages as number,
      error: error => console.error(error)
    });

    this.userService.getUsersPageable(this.currentPage).subscribe(
      users => this.users = users,
      error => console.error(error)
    );

   }

  more() {
    if(this.currentPage < this.maxPages) {
      this.loadUsers(++this.currentPage);
    }
  }

  private loadUsers(page: number) {
    this.userService.getUsersPageable(page).subscribe({
      next: history => {
        for(let u of history)
          this.users.push(u);
      },
      error: error => console.error(error)
    });
  }


   deleteUser(id?: number){
    this.userService.deleteUser(id!).subscribe(
      user => {
        this.users.forEach((element,index)=>{if(element.id==id!){ this.users.splice(index,1);}});
      },
      error => console.error(error)
    );
   }


    editUserLoad(id?: number){
      var element = <HTMLElement> document.getElementById("modalAddEditUserData");

      element.style.display = "block";
      element.classList.remove("fade");

      this.event="update";
      this.id=id!;
      this.username = this.users[id!-1].username;
      this.email= this.users[id!-1].email;
      this.name= this.users[id!-1].name;
      this.lastName= this.users[id!-1].lastName;
      this.address= this.users[id!-1].address;
      this.phoneNumber= this.users[id!-1].phoneNumber;
      this.birthDate = this.users[id!-1].birthDate;
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
      this.phoneNumber= 0;
      this.birthDate = "";
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
        phoneNumber: this.phoneNumber,
        birthDate: this.birthDate,
        role: this.role
      };

      if(this.event.match("update")){

        this.userService.updateUserAdmin(data).subscribe(
          user => {this.users[this.id-1] = user, this.close()},
          error => console.error(error)
        );

      }else{
        this.userService.addUser(data).subscribe(
          user => {this.users.push(user), this.close()},
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
