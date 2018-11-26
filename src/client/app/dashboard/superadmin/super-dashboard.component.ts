import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/authentication/auth.service';

import { User } from '../../shared/user.model';

/**
 * This class represents the lazy loaded DashboardComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'cg-super-dashboard',
    templateUrl: 'super-dashboard.component.html',
    styleUrls: ['super-dashboard.component.css'],
})
export class SuperDashboardComponent implements OnInit {
    // Doughnut
    public doughnutChartLabels: string[] = ['UA&P', 'La Salle', 'Ateneo'];
    public doughnutChartData: number[] = [500, 1500, 1400];
    public doughnutChartType = 'doughnut';

    public lineChartData: Array<any> = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
        { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
    ];
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend = true;
    public lineChartType = 'line';


    // Radar
    public radarChartLabels: string[] = ['Jump Exercise', 'Events', 'Actions', 'Logic', 'Coding', 'Sprites', 'Sounds'];

    public radarChartData: any = [
        { data: [65, 59, 90, 81, 56, 55, 40], label: 'UA&P' },
        { data: [44, 33, 22, 11, 22, 33, 44], label: 'La Salle' },
        { data: [28, 48, 40, 19, 96, 27, 100], label: 'Ateneo' }
    ];

    public radarChartType = 'radar';

    private user: User;

    // events
    public chartRadarClicked(e: any): void {
        console.log(e);
    }

    public chartRadarHovered(e: any): void {
        console.log(e);
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    // events
    public chartLineClicked(e: any): void {
        console.log(e);
    }

    public chartLineHovered(e: any): void {
        console.log(e);
    }

    /**
     * Creates an instance of the DashboardComponent.
     */
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    /**
     * OnInit
     */
    ngOnInit() {
        const user = this.authService.getActiveUser();
    }
}
