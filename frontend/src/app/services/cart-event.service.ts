import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartEventService {

  private action = new BehaviorSubject<string>('update');
  cartBus$ = this.action.asObservable();

  constructor() { }

  emitCartEvent(action: string) {
    this.action.next(action);
  }

}
