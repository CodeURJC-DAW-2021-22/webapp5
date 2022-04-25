import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})


export class AppComponent {
  admin = true;

  constructor(private httpClient: HttpClient) { }
}
