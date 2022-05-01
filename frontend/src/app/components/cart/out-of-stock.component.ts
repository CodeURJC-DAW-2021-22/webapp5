import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-out-of-stock',
  templateUrl: './out-of-stock.component.html'
})
export class OutOfStockComponent {

  productId: number;

  constructor(private router: Router, activatedRoute: ActivatedRoute) {
    this.productId = activatedRoute.snapshot.params['id'];
  }

}
