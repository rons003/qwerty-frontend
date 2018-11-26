import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SectionsComponent } from './sections.component';
import { StudentComponent } from './student/student.component';
import { AuthGuard } from '../shared/authentication/auth.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'sections',
                component: SectionsComponent,
                canActivate: [ AuthGuard ],
                data: { title: 'Section Management' }
            },
            {
                path: 'sections/students',
                component: StudentComponent,
                canActivate: [ AuthGuard ],
                data: { title: 'Student List' }
            }
        ])
    ],
    exports: [RouterModule]
})
export class SectionsRoutingModule { }
