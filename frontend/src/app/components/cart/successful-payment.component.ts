import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successful-payment',
  templateUrl: './successful-payment.component.html'
})

export class SuccessfulPaymentComponent {

  constructor(private router: Router, private httpClient: HttpClient) {
    this.httpClient.get("/api/users/me", {withCredentials: true}).subscribe({
      error: _ => this.router.navigate(['/login'])
    });
  }

}
