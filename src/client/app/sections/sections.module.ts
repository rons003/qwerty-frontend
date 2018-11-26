// Angular Imports
import { NgModule } from '@angular/core';
import { SectionsComponent } from './sections.component';
import { StudentComponent } from './student/student.component';
import { SectionsRoutingModule } from './sections-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SectionService } from './section.service';

@NgModule({
    imports: [
        SectionsRoutingModule, SharedModule
    ],
    declarations: [
        SectionsComponent, StudentComponent
    ],
    exports: [
        SectionsComponent, StudentComponent
    ],
    providers: [SectionService],
})
export class SectionsModule {

}
