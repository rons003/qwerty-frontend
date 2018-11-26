import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    // If the user is not an admin, we'll send them back to the home page
    if (!this.auth.isActiveUserSuperAdmin()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}
