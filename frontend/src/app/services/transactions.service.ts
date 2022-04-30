import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Transaction } from '../models/transaction.model';
import { Product } from '../models/product.model';

const BASE_URL = '/api/transactions';
const BASE_CART_URL = BASE_URL + '/cart/me';
const BASE_WISHLIST_URL = BASE_URL + '/wishlist/me';

@Injectable({ providedIn: 'root' })
export class TransactionsService {

  constructor(private httpClient: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.httpClient.get(BASE_URL, {withCredentials: true}).pipe(
      map(response => response as Transaction[]),
      catchError(error => this.handleError(error))
    ) as Observable<Transaction[]>;
  }

  getTransaction(id: number | string): Observable<Transaction> {
    return this.httpClient.get(BASE_URL + id, {withCredentials: true}).pipe(
      map(transaction => transaction as Transaction),
      catchError(error => this.handleError(error))
    ) as Observable<Transaction>;
  }

  getCart(): Observable<Transaction> {
    return this.httpClient.get(BASE_CART_URL, { withCredentials: true }).pipe(
      map(cart => cart as Transaction),
      catchError(error => this.handleError(error))
    ) as Observable<Transaction>;
  }

  addProductToCart(id: number | string) {
    return this.httpClient.post(BASE_CART_URL + '/products/' + id, "", { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteProductFromCart(id: number | string) {
    return this.httpClient.delete(BASE_CART_URL + '/products/' + id, { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteAllProductFromCart(id: number | string) {
    return this.httpClient.delete(BASE_CART_URL + '/products/' + id + '?all=true', { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  emptyCart() {
    return this.httpClient.delete(BASE_CART_URL, {withCredentials: true}).pipe(
      catchError(error => this.handleError(error))
    );
  }

  purchaseCart(cart: Transaction): Observable<Transaction> {
    if(!this.checkCart(cart)) throw new Error("Invalid Cart")
    cart = this.transformCart(cart);
    return this.httpClient.put(BASE_CART_URL, cart, {withCredentials: true}).pipe(
      map(response => response as Transaction),
      catchError(error => this.handleError(error))
    );
  }

  private checkCart(cart: Transaction): boolean {
    return cart.type.toUpperCase() === "CART";
  }

  private transformCart(cart: Transaction): Transaction {
    cart.type = 'PAID';
    return cart;
  }

  getWishlist(): Observable<Transaction> {
    return this.httpClient.get(BASE_WISHLIST_URL, { withCredentials: true }).pipe(
      map(wishlist => wishlist as Transaction),
      catchError(error => this.handleError(error))
    ) as Observable<Transaction>;
  }

  getProductFromWishlist(id: number | string): Observable<Product> {
    return this.httpClient.get(BASE_WISHLIST_URL + '/products/' + id, {withCredentials: true}).pipe(
      map(product => product as Product),
      catchError(error => this.handleError(error))
    )
  }

  addProductToWishlist(id: number | string) {
    return this.httpClient.post(BASE_WISHLIST_URL + '/products/' + id, "", { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteProductFromWishlist(id: number | string) {
    return this.httpClient.delete(BASE_WISHLIST_URL + '/products/' + id, { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  emptyWishlist() {
    return this.httpClient.delete(BASE_WISHLIST_URL, { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getPurchaseHistory(page: number): Observable<Transaction[]> {
    return this.httpClient.get("/api/transactions/purchaseHistory/me?page=" + page, { withCredentials: true }).pipe(
      map(transactions => transactions as Transaction[]),
      catchError(error => this.handleError(error))
    ) as Observable<Transaction[]>;
  }

  private handleError(error: any) {
    console.log('ERROR:');
    console.error(error);
    return throwError('Server error (' + error.status + '): ' + error.text());
  }

}
