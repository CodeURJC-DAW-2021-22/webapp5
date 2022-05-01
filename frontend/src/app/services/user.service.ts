import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


const BASE_URL = '/api/users/';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get(BASE_URL).pipe(
      map(response => response as any)
    )
  }

  getUserLogged(): Observable<User>{
    return this.httpClient.get(BASE_URL+"me").pipe(
      map(response => response as User)
    )
  }

  updateUser(data: { id: string; username: string; password?: any; email: string; name: string; lastName: string; address: string; mobileNumber: number; birthdate: string; role: string }): Observable<User>{
    return this.httpClient.put(BASE_URL+"userInfo", data).pipe(
      map(response => response as User)
    )
  }

  updatePass(data : { oldPass: string; newPass: string; newConfPass: string}):Observable<User>{
    return this.httpClient.put(BASE_URL+"password", data).pipe(
      map(response => response as User)
    )
  }

  updateUserAdmin(data: { id: number; username: string; password?: any; email: string; name: string; lastName: string; address: string; mobileNumber: number; birthdate: string; role: string }): Observable<User>{
    return this.httpClient.put(BASE_URL+data.id, data).pipe(
      map(response => response as User)
    )
  }

  addUser(data: { id: number; username: string; password?: any; email: string; name: string; lastName: string; address: string; mobileNumber: number; birthdate: string; role: string }): Observable<User>{
    return this.httpClient.post(BASE_URL, data).pipe(
      map(response => response as User)
    )
  }

  deleteUser(id:number){
    return this.httpClient.delete(BASE_URL+id).pipe(
      map(response => response as User)
    )
  }

  register(data: { id?: string; username: string; password: any; email: string; name?: string; lastName?: string; address?: string; mobileNumber?: string; birthdate?: string; role: string }){

    return this.httpClient.post(BASE_URL, data).pipe(
      map(response => response as User)
    )
  }

  allFields(id:number){
    let users: User[];
    users=[];
    this.getUsers().subscribe(
      users => users = users,
      error => console.error(error)
    );
    if(users[id-1].name.match("") || users[id-1].lastName.match("") || users[id-1].address.match("") || users[id-1].email.match("")){
      return false;
    }else{
      return true;
    }
  }
}
