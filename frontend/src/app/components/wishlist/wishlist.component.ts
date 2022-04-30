import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionsService } from 'src/app/services/transactions.service';

interface ProductEntry {
  id: number,
  product: Product
}

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html'
})
export class WishlistComponent {

  entries: ProductEntry[] = new Array<ProductEntry>();

  constructor(private router: Router, private service: TransactionsService, private httpClient: HttpClient) {
    //this.loginService.reqIsLogged();
    this.httpClient.get("/api/users/me", {withCredentials: true}).subscribe({
      complete: () => this.service.getWishlist().subscribe({
        next: wishlist => this.entries = this.extractProductEntries(wishlist),
        error: error => console.error(error)
      }),
      error: _ => this.router.navigate(['/login'])
    });
  }

  private extractProductEntries(wishlist: Transaction): ProductEntry[] {
    let entries: ProductEntry[] = new Array<ProductEntry>();
    for(let product of wishlist.products) {
      if(product.id !== undefined) {
        if(!entries.some(entry => entry.id === product.id)) {
          entries.push(this.getNewEntry(product));
        }
      } else {
        console.error("Product Id not found");
      }
    }
    return entries;
  }

  private getNewEntry(product: Product): ProductEntry {
    let id: number = -1;
    if(product.id !== undefined) id = product.id;
    return {
      id: id,
      product: product
    };
  }

  emptyWishlist() {
    this.service.emptyWishlist().subscribe({
      complete: () => this.entries = new Array<ProductEntry>(),
      error: error => console.error(error)
    });
  }

  deleteFromWishlist(index: number) {
    let entry: ProductEntry = this.entries[index];
    this.service.deleteProductFromWishlist(entry.id).subscribe({
      complete: () => this.entries.splice(index, 1),
      error: error => console.error(error)
    });
  }

  addToCart(index: number) {
    let entry: ProductEntry = this.entries[index];
    this.service.addProductToCart(entry.id, 1).subscribe({
      error: error => console.error(error)
    });
  }

}
