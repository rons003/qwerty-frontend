import { NgModule } from '@angular/core';
import { PasswordComponent } from './password.component';
import { PasswordRoutingModule } from './password-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [ PasswordRoutingModule, SharedModule ],
  declarations: [ PasswordComponent],
  exports: [ PasswordComponent],
  providers: [],
})
export class PasswordModule { }
