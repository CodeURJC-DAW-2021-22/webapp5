import { HttpClient } from '@angular/common/http';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { LoginService } from '../services/login.service';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

@Component({
  selector: 'adminHome',
  templateUrl: './adminHome.component.html'
})

export class AdminHomeComponent{
  randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
  randomRGB = () => `rgba(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()}, 0.2)`;

  constructor(private httpClient: HttpClient, public loginService: LoginService, private router: Router){
    this.httpClient.get("/api/users/me", {withCredentials: true}).subscribe({
      next: response => {
        let user = response as User;
        if(user.role.toUpperCase().match("ADMIN")) {
          this.loadCharts();
        } else {
          this.router.navigate(['/']);
        }
      },
      error: _ => this.router.navigate(['/login'])
    });
  }

  private loadCharts() {
    this.httpClient.get("/api/statics").subscribe({
      next: response => {
        let label: any[] = []
        let dataIncomes: any[] = []
        let dataSales: any[] = []
        let backgroundColor: any[] = []
        let products = []
        products = response as []
        products.forEach(product =>{
            label.push(product["productName"])
            dataIncomes.push(product["incomes"])
            dataSales.push(product["sales"])
            backgroundColor.push(this.randomRGB())
        })
        this.initCharts(label, dataIncomes, dataSales, backgroundColor);
      },
      error: error => console.error(error)
    });}

  initCharts(label: any[], dataIncomes: any[], dataSales: any[], backgroundColor: any[]){


    new Chart("Incomes", {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                data: dataIncomes,
                backgroundColor: backgroundColor,
                borderColor: 'rgba(43, 6, 23)',
                borderWidth: 2,
                label: 'quantity (u)',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    var Sales = new Chart("Sales", {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                data: dataSales,
                backgroundColor: backgroundColor,
                borderColor: 'rgba(43, 6, 23)',
                borderWidth: 2,
                label: 'dollars ($)',
            }]
        },
        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}}
