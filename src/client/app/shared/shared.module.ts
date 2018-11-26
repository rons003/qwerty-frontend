import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';

import { UserService } from './user.service';
import { AuthService } from './authentication/auth.service';
import { AuthGuard } from './authentication/auth.guard';
import { SuperAdminGuard } from './authentication/superadmin.guard';
import { AdminGuard } from './authentication/admin.guard';

import { ExcludeElementsPipe } from '../shared/exclude-elements.pipe';

import { NameListService } from './name-list/name-list.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    NavbarComponent,
    ExcludeElementsPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    ExcludeElementsPipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [UserService, AuthService, AuthGuard, SuperAdminGuard, AdminGuard, ExcludeElementsPipe, NameListService]
    };
  }
}
