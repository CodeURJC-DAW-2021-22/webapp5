import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { ProductsService } from 'src/app/services/products.service';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'productView',
  templateUrl: './productView.component.html'
})


export class ProductViewComponent {
    user: User;
    isLogged: boolean = false;
    inWishlist: boolean = false;
    inStock: boolean = true;
    inCart: boolean = false;
    chosenImage: number = 0;
    availableProducts: Product[];

    product: Product;
    sizeEnum: Product["size"][];
    availableSizes: Product["size"][];
    constructor(private router: Router, private httpClient: HttpClient,
        activatedRoute: ActivatedRoute, service: ProductsService) {
            
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
       
        let id = activatedRoute.snapshot.params['id'];
        service.getProduct(id).subscribe({
            next: product => this.product = product,
            error: error => console.error(error)
        });

        service.getProduct(id).subscribe({
            next: product => {
                this.product = product;
                service.getProductsByName(this.product.name).subscribe({
                    next:  products => this.availableProducts = products,
                    error: error => console.error(error)
                });
            },
            error: error => console.error(error)
        });

    }

    changeSize(size: any){
        //Have the ProductSize enum type here
    }

    addToWishlist(id: number | undefined){

    }

    getAvailableSizes(){
        for(let prod of this.availableProducts){
            this.availableSizes.push(prod.size);
        }
    }
}
