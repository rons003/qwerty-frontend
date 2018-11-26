import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SectionComponent } from './section.component';

import { AdminGuard } from '../../../shared/authentication/admin.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'section',
                component: SectionComponent,
                canActivate: [AdminGuard],
                data: { title: 'Section', breadcrumb: 'section' }
            }
        ])
    ],
    exports: [RouterModule]
})
export class SectionRoutingModule { }
