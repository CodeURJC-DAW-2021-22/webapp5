import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product } from '../models/product.model';

const BASE_URL = '/api/products';

enum ProductSize {XS = "XS", S = "S", M = "M", L = "L", XL = "XL"};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  	
	addProduct(data: { id: number; name: string; description: string; price: number; stock: number; size: ProductSize; }) {
		return this.httpClient.post(BASE_URL, data).pipe(
			map(product => product as Product),
			catchError(error => this.handleError(error))
		);
	}
  
	updateProduct(data: { id: number; name: string; description: string; price: number; stock: number; size: ProductSize;}) {
		return this.httpClient.put(BASE_URL + "/" + data.id, data).pipe(
			map(product => product as Product),
			catchError(error => this.handleError(error))
		);
	}

	addImage(productId: number, image: File) {
		return this.httpClient.post(BASE_URL + "/" + productId + "/image", {"imageFile": image}).pipe(
			map(image => image as File),
			catchError(error => this.handleError(error))
		);
	}
  
	deleteProduct(id: number) {
		return this.httpClient.delete(BASE_URL + "/" + id).pipe(
			map(product => product as Product),
			catchError(error => this.handleError(error))
		);
	}

	getSizes(){
		return [ProductSize.XS, ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL];
	}

    getProduct(id: number): Observable<Product> {
        return this.httpClient.get(BASE_URL + "/" + id).pipe(
			map(product => product as Product),
			catchError(error => this.handleError(error))
		) as Observable<Product>;
    }

	getProductsByName(name: string): Observable<Product[]> {
        return this.httpClient.get(BASE_URL + "?name=" + name).pipe(
			map(products => products as Product[]),
			catchError(error => this.handleError(error))
		) as Observable<Product[]>;
    }

	constructor(private httpClient: HttpClient) { }

	getProducts(page?: number): Observable<Product[]> {
		let url = "";
		if(page === undefined){
			url = BASE_URL + "?isDistinct=true";
		}else{
			url = BASE_URL + "?isDistinct=true&page="+page;
		}
		return this.httpClient.get(url).pipe(
			map(products => products as Product[]),
			catchError(error => this.handleError(error))
		) as Observable<Product[]>;
	}

	private handleError(error: any) {
		console.log("ERROR:");
		console.error(error);
		return throwError(() => new Error("Server error (" + error.status + "): " + error.text()))
	}
}