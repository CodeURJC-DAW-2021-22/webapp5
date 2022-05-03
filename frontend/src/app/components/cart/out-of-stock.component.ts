import { ProductsService } from './../../services/products.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-out-of-stock',
  templateUrl: './out-of-stock.component.html'
})
export class OutOfStockComponent {

  productId: number;
  productName: string;
  productStock: number;

  constructor(private router: Router, activatedRoute: ActivatedRoute, private httpClient: HttpClient, private productsService: ProductsService) {
    this.httpClient.get("/api/users/me", {withCredentials: true}).subscribe({
      error: _ => this.router.navigate(['/login'])
    });
    this.productId = activatedRoute.snapshot.params['id'];
    this.productsService.getProduct(this.productId).subscribe({
      next: product => {
        this.productName = product.name;
        this.productStock = product.stock;
      },
      error: error => console.error(error)
    })
  }

}
