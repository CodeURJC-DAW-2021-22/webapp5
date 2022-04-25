import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})


export class AppComponent {
  admin = true;
}
