import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-out-of-stock',
  templateUrl: './out-of-stock.component.html'
})
export class OutOfStockComponent {

  productId: number;

  constructor(private router: Router, activatedRoute: ActivatedRoute, private httpClient: HttpClient) {
    this.httpClient.get("/api/users/me", {withCredentials: true}).subscribe({
      error: _ => this.router.navigate(['/login'])
    });
    this.productId = activatedRoute.snapshot.params['id'];
  }

}
