import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';

schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'headerUser',
  templateUrl: './header.component.html'
})

export class HeaderComponent{
  constructor(private httpClient: HttpClient, public loginService: LoginService) { }
}
