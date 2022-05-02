import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from '../../models/product.model';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'productsList',
  templateUrl: './productsList.component.html'
})


export class ProductsListComponent implements OnInit{
    products: Product[];

    constructor(private router: Router, private service: ProductsService) { }

    ngOnInit() {
        this.service.getProducts().subscribe({
          next: products => this.products = products,
          error: error => console.log(error)
        });
    }

    more(){ }

}
