import { HttpClient } from '@angular/common/http';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { UserService } from '../services/user.service';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'manageProducts',
  templateUrl: './manageProducts.component.html'
})

export class ManageProductsComponent{

  id!:number;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;
  size!: Product["size"];
  images!: string[];
  event: string;
  imageFile?: File = undefined;

  products: { [name: number]: Product } = {};

  currentPage: number=1;
  maxPages: number=1;

  constructor(private httpClient: HttpClient, public productsService: ProductsService, public userService: UserService, public router: Router) {

    this.event="";

    this.userService.getUserLogged().subscribe(
      user => {},
      error => console.error(error)
    );

    this.httpClient.get("/api/products/maxPages", {withCredentials: true}).subscribe({
      next: maxPages => this.maxPages = maxPages as number,
      error: error => console.error(error)
    });

    this.productsService.getProducts(this.currentPage).subscribe(
      products => {products.forEach(
        product => this.products[product.id!] = product
      )},
      error => console.error(error)
    );

  }

  more() {
    if(this.currentPage < this.maxPages) {
      this.loadProducts(++this.currentPage);
    }
  }

  private loadProducts(page: number) {
    this.productsService.getProducts(page).subscribe({
      next: history => {
        for(let u of history)
          this.products[u.id!] = u;
      },
      error: error => console.error(error)
    });
  }


  deleteProduct(id?: number){
  this.productsService.deleteProduct(id!).subscribe(
    product => {
      delete this.products[id!];
    },
    error => console.error(error)
  );
  }


  editProductLoad(id?: number){
    var element = <HTMLElement> document.getElementById("modalAddEditProductData");

    element.style.display = "block";
    element.classList.remove("fade");

    this.event="update";
    this.id=id!;
    this.name = this.products[id!].name;
    this.description = this.products[id!].description;
    this.price = this.products[id!].price;
    this.stock = this.products[id!].stock;
    this.size = this.products[id!].size;
    this.images = this.products[id!].images;

  };

  addProductLoad(){
    this.event="add";
    var element = <HTMLElement> document.getElementById("modalAddEditProductData");

    element.style.display = "block";
    element.classList.remove("fade");

    this.id = 0;
    this.name = "";
    this.description = "";
    this.price = 0;
    this.stock = 0;
    this.size = 0;
    this.images= [];
  }

  done(){

    var data = {
      id: this.id,
      name: this.name,
      description: this.description,
      price:  this.price,
      stock: this.stock,
      size: this.size,
      images: this.images
    };

    if(this.event.match("update")){

      this.productsService.updateProduct(data).subscribe(
        product => {this.products[this.id!] = product, this.close()},
        error => console.error(error)
      );

    }else{
      this.productsService.addProduct(data).subscribe(
        product => {this.products[product.id!] = product, this.close()},
        error => console.error(error)
      );
      if(this.imageFile !== undefined)
        this.productsService.addImage(data.id, this.imageFile).subscribe(
          image => {},
          error => console.error(error)
        );
    }

  }

  close(){
    const element = <HTMLElement> document.getElementById("modalAddEditProductData");

    element.style.display = "none";
    element.classList.add("fade");

  }


}
