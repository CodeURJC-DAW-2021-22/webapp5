import { Transaction } from './../../models/transaction.model';
import { CartComponent } from './../cart/cart.component';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionsService } from 'src/app/services/transactions.service';
import { ProductEntry } from '../cart/cart.component';

interface TransactionView {
  id: number,
  date: string,
  type: string,
  entries: ProductEntry[],
  totalPrice: number
}

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html'
})
export class PurchaseHistoryComponent {

  transactions: TransactionView[] = new Array<TransactionView>();
  currentPage: number = 1;
  maxPages: number = 1;

  constructor(private router: Router, private service: TransactionsService, private httpClient: HttpClient) {
    //this.loginService.reqIsLogged();
    this.httpClient.get("/api/users/me", {withCredentials: true}).subscribe({
      complete: () => {
        this.loadTransactions(this.currentPage);
        this.httpClient.get("/api/transactions/purchaseHistory/me/maxPages", {withCredentials: true}).subscribe({
          next: maxPages => this.maxPages = maxPages as number,
          error: error => console.error(error)
        });
      },
      error: _ => this.router.navigate(['/login'])
    });
  }

  more() {
    if(this.currentPage < this.maxPages) {
      this.loadTransactions(++this.currentPage);
    }
  }

  private loadTransactions(page: number) {
    this.service.getPurchaseHistory(page).subscribe({
      next: history => {
        for(let transaction of history)
          this.transactions.push(this.extractTransactionView(transaction));
      },
      error: error => console.error(error)
    });
  }

  private extractTransactionView(transaction: Transaction): TransactionView {
    let transView: TransactionView = {id: -1, date: transaction.date, type: transaction.type, entries: CartComponent.extractProductEntries(transaction), totalPrice: transaction.totalPrice};
    if(transaction.id !== undefined) {
      transView.id = transaction.id;
    }
    return transView;
  }

}
