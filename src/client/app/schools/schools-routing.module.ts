import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SchoolsComponent } from './schools.component';
import { StudentComponent } from './student/student.component';
import { AuthGuard } from '../shared/authentication/auth.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'schools',
                component: SchoolsComponent,
                canActivate: [AuthGuard],
                data: { title: 'School Management' }
            },
            {
                path: 'schools/student',
                component: StudentComponent,
                canActivate: [ AuthGuard ],
                data: { title: 'Student List' }
            }

        ])
    ],
    exports: [RouterModule]
})
export class SchoolsRoutingModule { }
