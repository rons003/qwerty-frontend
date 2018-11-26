import { NgModule } from '@angular/core';
import { ModulesComponent } from './modules.component';
import { ModulesRoutingModule } from './modules-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ModuleService } from './module.service';



@NgModule({
  imports: [ModulesRoutingModule, SharedModule],
  declarations: [ModulesComponent ],
  exports: [ModulesComponent ],
  providers: [ModuleService ],
})
export class ModulesModule {
}
