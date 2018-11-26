import { Component } from '@angular/core';
import { Config } from './shared/config/env.config';
import { BreadcrumbService } from 'ng5-breadcrumb';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  constructor(private breadcrumbService: BreadcrumbService) {
    //console.log('Environment config', Config);
    breadcrumbService.addFriendlyNameForRoute('/superadmin', 'Admin');
    breadcrumbService.addFriendlyNameForRoute('/schools', 'School');
    breadcrumbService.addFriendlyNameForRoute('/superadmin/dashboard', 'Dashboard');
    breadcrumbService.addFriendlyNameForRoute('/sections', 'Sections');
    breadcrumbService.addFriendlyNameForRoute('/account', 'Account');
    breadcrumbService.addFriendlyNameForRouteRegex('/sections/students*', 'Students');
    breadcrumbService.addFriendlyNameForRouteRegex('/schools/students*', 'Students');
  }
}
