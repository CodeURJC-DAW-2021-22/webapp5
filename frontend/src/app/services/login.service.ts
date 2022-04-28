import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

const BASE_URL = '/api/auth';

@Injectable({ providedIn: 'root' })
export class LoginService {

    logged: boolean;
    user: User | undefined;

    constructor(private http: HttpClient, private router: Router) {
        this.logged = false;
        this.user= undefined;
        this.reqIsLogged();
    }

    reqIsLogged() {
        this.http.get('/api/users/me', { withCredentials: true }).subscribe(
            response => {
                this.user = response as User;
                this.logged = true;
            },
            error => {
                if (error.status != 404) {
                    console.error('Error when asking if logged: ' + JSON.stringify(error));
                }

            }
        );

    }

    logIn(user: string, pass: string) {

        this.http.post(BASE_URL + "/login", { username: user, password: pass }, { withCredentials: true })
            .subscribe(
                (response) => {this.reqIsLogged(), this.router.navigate(['']);},
                (error) => alert("Wrong credentials")
            );

    }

    logOut() {

        return this.http.post(BASE_URL + '/logout', { withCredentials: true })
            .subscribe((resp: any) => {
                console.log("LOGOUT: Successfully");
                this.logged = false;
                this.user = undefined;
                this.router.navigate(['']);
            });

    }

    register(data: { id?: string; username: string; password: any; email: string; name?: string; lastName?: string; address?: string; mobileNumber?: string; birthdate?: string; role: string }){
      this.http.post("api/users/", data)
            .subscribe(
                (response) => this.logIn(data.username, data.password),
                (error) => alert("Wrong credentials")
            );
    }

    isLogged() {
        return this.logged;
    }

    isAdmin() {
        return this.user && this.user.role.indexOf('ADMIN') !== -1;
    }

    currentUser() {
        return this.user;
    }
}
