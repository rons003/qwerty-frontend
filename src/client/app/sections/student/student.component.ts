import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/user.model';
import { SectionService } from '../section.service';
import { UserService } from '../../shared/user.service';
import { Section } from '../section.model';

declare var $: any; // jQuery

@Component({
    moduleId: module.id,
    selector: 'all-student',
    templateUrl: 'student.component.html',
    styleUrls: ['student.component.css']
})
export class StudentComponent implements OnInit {

    private section: Section;
    private studentList: User[];
    private school = '';
    private studentFromSchool: User[];
    private selectedStudentList = new Array();
    private deleteList = new Array();
    private toggleCb = false;

    constructor(
        private sectionService: SectionService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe((params: Section) => {
                if (params['id']) {
                    this.section = params;
                    this.getStudent(params['id']);
                    this.getStudentUsers();
                }
            });
    }

    getStudent(section_id: string) {
        this
            .userService
            .getStudentFromSection(section_id)
            .subscribe(
                (users: User[]) => {
                    this.studentList = [];
                    this.studentList = users;
                    console.log(this.studentList);
                }
            );
    }

    // getStudentFromSchool(school_id: string) {
    //     this
    //         .userService
    //         .getStudentFromSchool(school_id)
    //         .subscribe(
    //             (users: User[]) => {
    //                 this.studentFromSchool = [];
    //                 this.studentFromSchool = users;
    //             }
    //         );
    // }

    getStudentUsers() {
        this.userService.getAllStudents(0, 10)
            .subscribe(
                (users: User[]) => {
                    this.studentFromSchool = [];
                    if (users.length !== 0) {
                        this.studentFromSchool = users;
                    }
                },
                err => console.error(err)
            );
    }

    addStudent(section_id: string, user_id: string[]) {
        this
            .sectionService
            .addStudentToSection(section_id, user_id)
            .subscribe(
                (res: any) => {
                    console.log('Success Add Student to Section');
                    this.getStudent(this.section.id);
                }
            );
    }

    checkAdd(id: any) {
        if (!this.selectedStudentList.includes(id)) {
            this.selectedStudentList.push(id);
        } else {
            const index: number = this.selectedStudentList.indexOf(id);
            if (index !== -1) {
                this.selectedStudentList.splice(index, 1);
            }
        }
    }

    checkDelete(id: any) {
        if (!this.deleteList.includes(id)) {
            this.deleteList.push(id);
        } else {
            const index: number = this.deleteList.indexOf(id);
            if (index !== -1) {
                this.deleteList.splice(index, 1);
            }
        }
    }

    onSubmit() {
        if (this.checkAdd.length !== 0) {
            this.addStudent(this.section.id, this.selectedStudentList);
            this.hideModal();
        }
    }

    deleteStudent() {
        if (this.deleteList.length !== 0) {
            this
                .sectionService
                .deleteStudentFromSection(this.section.id, this.deleteList)
                .subscribe(
                    (res: any) => {
                        console.log('successfully deleted');
                        this.getStudent(this.section.id);
                    }
                );
        }
    }

    deleteToggle(id: any, i: number) {
        $('.checkBoxTd').removeClass('d-none');
        this.toggleCb = true;
        const selectedBox = $('.checkBoxes');
        if (!this.deleteList.includes(id)) {
            this.deleteList.push(id);
            selectedBox[i].checked = true;
        }
    }

    showModal() {
        this.selectedStudentList = new Array();
        //this.getStudentFromSchool(this.section.school_id);
        $('#student-list-modal').modal('show');
    }

    hideModal() {
        $('#student-list-modal').modal('hide');
    }
}
