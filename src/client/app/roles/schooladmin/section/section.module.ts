import { NgModule } from '@angular/core';
import { SectionComponent } from './section.component';
import { SectionRoutingModule } from './section-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        SectionRoutingModule,
        SharedModule
    ],
    declarations: [
        SectionComponent
    ],
    exports: [
        SectionComponent
    ],
    providers: [],
})
export class SectionModule {
}
