import { CartEventService } from './../services/cart-event.service';
import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'headerUser',
  templateUrl: './header.component.html'
})

export class HeaderComponent {

  $nCartItems: Observable<number>;

  constructor(private http: HttpClient, public loginService: LoginService, private eventService: CartEventService) {
    this.$nCartItems = this.updateCartNumber();
    this.eventService.cartBus$.subscribe({
      next: _ => this.$nCartItems = this.updateCartNumber()
    })
  }

  updateCartNumber(): Observable<number> {
    this.$nCartItems = this.http.get("/api/transactions/cart/me/size").pipe(
      map(number => number as number),
      catchError(async (_) => 0)
    );
    return this.$nCartItems;
  }

}
