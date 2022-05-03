import { TransactionsService } from './../../services/transactions.service';
import { Product } from './../../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { HeaderComponent } from '../header.component';

export interface ProductEntry {
  id: number,
  product: Product,
  quantity: number,
  totalPrice: number
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {

  entries: ProductEntry[] = new Array<ProductEntry>();

  @ViewChild(HeaderComponent) header!: HeaderComponent;

  public static extractProductEntries(cart: Transaction): ProductEntry[] {
    let entries: ProductEntry[] = new Array<ProductEntry>();
    for(let product of cart.products) {
      if(product.id !== undefined) {
        if(entries.some(entry => entry.id === product.id)) {
          let entry: ProductEntry | undefined = entries.find(entry => entry.id === product?.id)
          if(entry !== undefined) {
            entry.quantity++;
            entry.totalPrice += product.price;
          } else {
            entries.push(this.getNewEntry(product));
          }
        } else {
          entries.push(this.getNewEntry(product));
        }
      } else {
        console.error("Product Id not found");
      }
    }
    return entries;
  }

  public static getNewEntry(product: Product): ProductEntry {
    let id: number = -1;
    if(product.id !== undefined) id = product.id;
    return {
      id: id,
      product: product,
      quantity: 1,
      totalPrice: product.price
    };
  }

  constructor(private router: Router, private service: TransactionsService, private httpClient: HttpClient) {
    //this.loginService.reqIsLogged();
    this.httpClient.get("/api/users/me", {withCredentials: true}).subscribe({
      complete: () => this.service.getCart().subscribe({
        next: cart => {
          this.header.updateCartNumber();
          this.entries = CartComponent.extractProductEntries(cart);
        },
        error: error => console.error(error)
      }),
      error: _ => this.router.navigate(['/login'])
    });
  }

  emptyCart() {
    this.service.emptyCart().subscribe({
      complete: () => {
        this.entries = new Array<ProductEntry>();
        this.header.updateCartNumber();
      },
      error: error => console.error(error)
    });
  }

  increaseQuantity(index: number) {
    let entry: ProductEntry = this.entries[index];
    this.service.addProductToCart(entry.id, 1).subscribe({
      complete: () => {
        entry.quantity += 1;
        entry.totalPrice = entry.quantity * entry.product.price;
        this.header.updateCartNumber();
      },
      error: error => console.error(error)
    });
  }

  decreaseQuantity(index: number) {
    let entry: ProductEntry = this.entries[index];
    if(entry.quantity == 1) {
      this.delete(index);
    } else {
      this.service.deleteProductFromCart(entry.id).subscribe({
        complete: () => {
          entry.quantity -= 1;
          entry.totalPrice = entry.quantity * entry.product.price;
          this.header.updateCartNumber();
        },
        error: error => console.error(error)
      });
    }
  }

  delete(index: number) {
    let entry: ProductEntry = this.entries[index];
    this.service.deleteAllProductFromCart(entry.id).subscribe({
      complete: () => {
        this.entries.splice(index, 1);
        this.header.updateCartNumber();
      },
      error: error => console.error(error)
    });
  }

  getTotalPrice(): number {
    let total: number = 0;
    this.entries.forEach(entry => total += entry.totalPrice);
    return total;
  }

  getTotalItems(): number {
    let total: number = 0;
    this.entries.forEach(entry => total += entry.quantity)
    return total;
  }

  purchaseCart() {
    this.service.getCart().subscribe({
      next: cart => this.purchase(cart),
      complete: () => this.header.updateCartNumber(),
      error: error => console.error(error)
    })
  }

  private purchase(cart: Transaction) {
    if(this.checkCart(cart)) {
      this.service.purchaseCart(cart).subscribe({
        complete: () => {
          this.header.updateCartNumber();
          this.router.navigate(['/successfulPayment'])
        },
        error: error => console.error(error)
      });
    }
  }

  private checkCart(cart: Transaction): boolean {
    this.entries = CartComponent.extractProductEntries(cart);
    for(let entry of this.entries) {
      if(entry.quantity > entry.product.stock) {
        this.router.navigate(['/outOfStock', entry.product.id]);
        return false;
      }
    }
    return true;
  }

}
