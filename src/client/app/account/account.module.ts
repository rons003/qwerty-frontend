import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [AccountRoutingModule, SharedModule  ],
  declarations: [AccountComponent],
  exports: [ AccountComponent],
  providers: [],
})
export class AccountModule { }
