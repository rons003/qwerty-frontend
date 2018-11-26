// Angular Imports
import { NgModule } from '@angular/core';
import { SchoolsComponent } from './schools.component';
import { StudentComponent } from './student/student.component';
import { SchoolsRoutingModule } from './schools-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SchoolService } from './school.service';


@NgModule({
    imports: [
        SchoolsRoutingModule, SharedModule
    ],
    declarations: [
        SchoolsComponent, StudentComponent
    ],
    exports: [
        SchoolsComponent, StudentComponent
    ],
    providers: [SchoolService],
})
export class SchoolsModule {

}
