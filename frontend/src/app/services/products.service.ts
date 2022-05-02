import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product } from '../models/product.model';

const BASE_URL = '/api/products';

enum ProductSize {XS = "XS", S = "S", M = "M", L = "L", XL = "XL"};

@Injectable({ providedIn: 'root' })
export class ProductsService {

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

	getProducts(): Observable<Product[]> {
		return this.httpClient.get(BASE_URL + "?isDistinct=true").pipe(
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