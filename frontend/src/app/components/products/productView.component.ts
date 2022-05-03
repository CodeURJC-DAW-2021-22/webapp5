import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ResolveEnd, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { ProductsService } from 'src/app/services/products.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { HeaderComponent } from '../header.component';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'productView',
  templateUrl: './productView.component.html'
})


export class ProductViewComponent{
    @ViewChild(HeaderComponent) header!: HeaderComponent;
    id!: number;
    user!: User;
    isLogged: boolean = false;
    inWishlist: boolean = false;
    inCart: boolean = true;
    chosenImage: number = 0;
    availableProducts: Product[] = [];
    quantity: number = 1;

    product!: Product;
    sizeEnum: Product["size"][];
    availableSizes: Product["size"][] = [];
    availableStock: Product["stock"][] = [];
    productIds: number[] = [];

    constructor(private router: Router, private httpClient: HttpClient,
        private activatedRoute: ActivatedRoute, private service: ProductsService, public transactionService: TransactionsService) {
    
        this.sizeEnum = service.getSizes();
        this.httpClient.get('/api/users/me', { withCredentials: true }).subscribe({
            next: response => {
                this.isLogged = true,
                this.user = response as User;
            },
            error: error => {
                if (error.status != 404) {
                    console.error('Error when asking if logged: ' + JSON.stringify(error));
                }
        }})

        this.loadProduct();

        router.events.subscribe(
            (event) => {
                if(event instanceof NavigationEnd)
                    this.loadProduct()
            });

        //Get this product and all products with this name and different sizes
        service.getProduct(this.id).subscribe({
            next: product => {
                this.product = product;
                service.getProductsByName(this.product.name).subscribe({
                    next:  products => {this.availableProducts = products;
                         this.setAvailableSizes()},
                    error: error => console.error(error)
                });
            },
            error: error => console.error(error)
        });

        transactionService.getProductFromWishlist(this.id).subscribe({
            next: product => this.inWishlist = true, 
            error: error => this.inWishlist = false
        });

        // transactionService.getProductFromCart(id).subscribe({
        //     next: product => this.inCart = true, 
        //     error: error => this.inCart = false
        // });

    }

    loadProduct(){
        this.id = this.activatedRoute.snapshot.params['id'];
        this.service.getProduct(this.id).subscribe({
            next: product => this.product = product,
            error: error => console.error(error)
        });
    }

    removeFromWishlist(id: number){
        this.transactionService.deleteProductFromWishlist(id).subscribe({
            next: prod => {this.inWishlist = false},
            error: error => {}
        });
    }

    changeSize(id: number){
        this.router.navigate(["/productView/"+id]);
    }

    addToWishlist(id: number){
        this.transactionService.addProductToWishlist(id).subscribe({
            next: prod => {this.inWishlist = true},
            error: error => {}
        });
    }

    setAvailableSizes(){
        this.availableProducts.forEach(
            element => {
                this.productIds[element.size] = element.id!;
                this.availableSizes.push(element.size);
                this.availableStock.push(element.stock)
                }
        );
    }

    addToCart(id:number, quantity:number){
        this.transactionService.addProductToCart(id, quantity).subscribe({
            next: response => this.header.updateCartNumber(),
            error: error => console.log(error)
        });
        this.loadProduct();
    }
}
