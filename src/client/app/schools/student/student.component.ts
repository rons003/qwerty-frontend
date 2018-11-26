import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/user.model';
import { SchoolService } from '../school.service';
import { UserService } from '../../shared/user.service';
import { School } from '../school.model';

declare var $: any; // jQuery

@Component({
    moduleId: module.id,
    selector: 'all-student',
    templateUrl: 'student.component.html',
    styleUrls: ['student.component.css']
})
export class StudentComponent implements OnInit {

    private school: School;
    private studentId = new Array();
    private user = '';
    private users: User[];
    private studentList: User[];
    private studentFromUsers: User[];
    private selectedStudentList = new Array();
    private usertype = 0;
    private schoolStudent = true;
    private clearStudent: User;
    private selectedStudent: User;

    constructor(
        private schoolService: SchoolService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.clearStudent = new User();
        this.selectedStudent = this.clearStudent;
    }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe((params: School) => {
                if (params['id']) {
                    this.school = params;
                    this.getStudent(params['id']);
                }
            });
    }

    getStudent(school_id: string) {
        this
            .schoolService
            .getSchoolUsingId(school_id)
            .subscribe(
                (student: any) => {
                    this.studentList = [];
                    //this.school = student;
                    this.studentId = student.data.student_list;
                    console.log(student.data.student_list);
                   // this.studentList = users;
                    console.log(this.studentList);
                }
            );
    }

    addStudent(school_id: string, user_id: string[]) {
        this
            .schoolService
            .addStudentToSchool(school_id, user_id)
            .subscribe(
                (res: any) => {
                    console.log('Success Add Student to School');
                    this.getStudent(this.school.id);
                }
            );
    }

    checkAddToSchool(id: any) {
        if (!this.selectedStudentList.includes(id)) {
            this.selectedStudentList.push(id);
        } else {
            const index: number = this.selectedStudentList.indexOf(id);
            if (index !== -1) {
                this.selectedStudentList.splice(index, 1);
            }
        }
    }


    onSubmit() {
        if (this.checkAddToSchool.length !== 0) {
            this.addStudent(this.school.id, this.selectedStudentList);
            this.hideModal();
        }
    }

    getStudentUsers(searchText?: any) {
        if (searchText) {
            this.userService.searchStudentUser(searchText)
                .subscribe(
                    (users: User[]) => {
                        this.users = users;
                    },
                    err => console.error(err)
                );
        } else {
            this.userService.getAllStudents(0, 10)
                .subscribe(
                    (users: User[]) => {
                        if (this.schoolStudent) {
                            this.users = users;
                        } else {
                            this.users = users;
                            this.selectedStudent = this.users[0];
                        }
                    },
                    err => console.error(err)
                );
        }
    }


    showModal() {
        this.getStudentUsers();
        $('#student-list-modal').modal('show');
    }

    hideModal() {
        $('#student-list-modal').modal('hide');
    }
}
