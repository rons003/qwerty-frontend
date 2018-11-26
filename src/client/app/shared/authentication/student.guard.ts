import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class StudentGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    // If the user is not an admin, we'll send them back to the home page
    if (!this.auth.isActiveUserStudent()) {
      this.router.navigate(['projects']);
      return false;
    }
    return true;
  }

}
