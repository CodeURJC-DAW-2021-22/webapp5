import { TransactionsService } from 'src/app/services/transactions.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

interface ProductEntry {
  product: Product,
  inWishlist: boolean
}

@Component({
  selector: 'productsList',
  templateUrl: './productsList.component.html'
})


export class ProductsListComponent {

    entries = new Array<ProductEntry>();

    currentPage: number = 1;
    maxPages: number = 1;


    constructor(private router: Router, private service: ProductsService, private transactionsService: TransactionsService, private httpClient: HttpClient) {
      this.loadProducts(this.currentPage);
      this.httpClient.get("/api/products/maxPages?isDistinct=true").subscribe({
        next: max => this.maxPages = max as number,
        error: error => console.error(error)
      });
    }

    updateWishlistState(index: number) {
      this.transactionsService.getProductFromWishlist(this.entries[index].product.id!).subscribe({
        next: product => this.entries[index].inWishlist = true,
        error: error => this.entries[index].inWishlist = false
      });
    }

    loadProducts(page: number) {
      this.service.getProducts(page).subscribe({
        next: products => {
          for(let index=0; index<products.length; index++) {
            this.entries.push({product: products[index], inWishlist: false});
            this.updateWishlistState(index);
          }
        },
        error: error => console.log(error)
      });
    }

    setWishlist(index: number , status: boolean) {
      if(status) {
        this.transactionsService.addProductToWishlist(this.entries[index].product.id!).subscribe({
          next: _ => this.updateWishlistState(index),
          error: error => console.error(error)
        });
      } else {
        this.transactionsService.addProductToWishlist(this.entries[index].product.id!).subscribe({
          next: _ => this.updateWishlistState(index),
          error: error => console.error(error)
        });
      }
    }

    more(){
      if(this.currentPage < this.maxPages) this.loadProducts(++this.currentPage);
    }

}
