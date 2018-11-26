import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/authentication/auth.service';

import { User } from '../shared/user.model';

declare var $: any; // jQuery

/**
 * This class represents the welcome page.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  private user: object = {}; // Holds the form model
  private modalHeading = '';
  private isLoginUnsuccessful = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {

  }

  showModal() {
    $('#loginModal').modal('show');
  }

  closeModal() {
    $('#loginModal').modal('hide');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    // empty
  }

  onSubmit(user: any) {
    this
      .authService
      .login(user.email, user.password)
      .subscribe(
        (user: any) => {
          if (user.status_code === 200) {
            this.closeModal();
            if (this.authService.isActiveUserSuperAdmin()) {
              this.router.navigate(['superadmin/dashboard']);
              console.log('Logged in as super admin');
            } else if (this.authService.isActiveUserAdmin()) {
              this.router.navigate(['/mymodules']);
              console.log('Logged in as school admin');
            } else if (this.authService.isActiveUserTeacher()) {
              this.router.navigate(['/mymodules']);
              console.log('Logged in as teacher');
            } else {
              this.router.navigate(['/mymodules']);
              console.log('Logged in as student');
            }
          } else {
            //this.router.navigate(['/login']);
            console.log('Unsuccessful login');
            this.isLoginUnsuccessful = true;
          }
        },
        err => console.error('Unsuccessful login: ' + err),
    );
  }
}
