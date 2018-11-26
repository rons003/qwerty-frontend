import { Component } from '@angular/core';
declare var $: any; // jQuery

@Component({
    moduleId: module.id,
    selector: 'cg-teacher',
    templateUrl: 'teacher.Component.html',
    styleUrls: ['teacher.component.css']

})

export class TeacherComponent {
    private show = true;

    showModal() {
        if (this.show === true) {
            $('#centralModalInfo').modal('show');
        }
        return this.show = false;
    }

}
