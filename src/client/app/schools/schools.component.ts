import { Component, OnInit } from '@angular/core';

import { SchoolService } from './school.service';
import { AuthService } from '../shared/authentication/auth.service';
import { School } from './school.model';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';

declare var $: any; // jQuery

@Component({
    moduleId: module.id,
    selector: 'cg-schools',
    templateUrl: 'schools.component.html',
    styleUrls: ['schools.component.css']
})
export class SchoolsComponent implements OnInit {

    private school: object = {};
    private schools: School[];
    private users: User[];
    private selectedSchool: School;
    private selectedUser: User;
    private clearSchool: School;
    private toggleCb = false;
    private isChecked = false;
    private guideModal = true;
    private deleteList = new Array();

    constructor(private authService: AuthService, private schoolService: SchoolService, private userService: UserService) {
        this.clearSchool = new School();
        this.selectedSchool = this.clearSchool;
    }
    moduleModal() {
        $('#moduleModal').modal('show');
    }

    hideModal() {
        $('#moduleModal').modal('hide');
    }

    /**
   * OnInit
   */
    ngOnInit() {
       this.getSchools();
       this.getUsers();
    }

    getSchools(searchText?: any) {
        if (searchText) {
            //console.log('seachTextValue is' + searchText);
            this.schoolService.searchSchool(searchText)
            .subscribe(
                (schools: School[]) => {
                    this.schools = schools;
                },
                err => console.error(err)
            );
        } else {
        this.schoolService.getAllSchools(0, 10)
            .subscribe(
                (schools: School[]) => {
                    this.schools = schools;
                },
                err => console.error(err)
            );
        }
    }

    getUsers() {
        this.userService.getAllUsers(0, 10)
            .subscribe(
            (users: User[]) => { this.users = users;
                this.selectedUser = this.users[0];
            },
                err => console.error(err)
            );
    }

    onSubmit() {
        if (this.selectedSchool.id) {
            this.schoolService.updateSchool(this.selectedSchool)
                .subscribe((res: boolean) => console.log(res),
                    err => console.error(err)
                );
        } else {
            this.schoolService.createSchool(this.selectedSchool)
                .subscribe((res: any) => {
                    this.schools.push(this.selectedSchool);
                    this.clearSchool = new School();
                },
                    err => console.error(err)
                );
                this.getSchools();
        }
        this.selectedSchool = this.clearSchool;
        this.hideModal();
    }

    select(schools: School) {
        this.selectedSchool = schools;
        this.moduleModal();
    }

    selectAll() {
        const selectedBox = $('.checkBoxes');
        this.isChecked = !this.isChecked;
        if (this.isChecked) {
            this.schools.forEach((school, i = 0) => {
                if (!this.deleteList.includes(school.id)) {
                    this.deleteList.push(school.id);
                    selectedBox[i].checked = true;
                }
            });
        } else {
            //selectedBox.each(() => $(this).checked = false);
            for (let i = 0; i < selectedBox.length; i++) {
                selectedBox[i].checked = false;
            }
            this.deleteList = new Array();
        }
    }

    createNewSchool() {
        this.selectedSchool = this.clearSchool;
        this.selectedSchool.name = '';
        this.moduleModal();
    }

    deleteSchool() {
       /* console.log(school.id);
        this.schoolService.deleteSchool(school)
            .subscribe((res: boolean) => console.log(res),
                err => console.error(err)
        );
        this.getSchools();
        this.getSchools();*/
        let id = '';
        for (id of this.deleteList) {
            this
                .schoolService
                .deleteSchool(id)
                .subscribe(
                    (res: any) => {
                        //
                    },
                    err => console.error('Unsuccessful: ' + err)
                );
        }
        this.deleteList = new Array();
        this.toggleCb = false;
        $('.checkBoxTd').addClass('d-none');
        this.getSchools();
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

    checkDeletes(id: any) {
        if (!this.deleteList.includes(id)) {
            this.deleteList.push(id);
        } else {
            const index: number = this.deleteList.indexOf(id);
            if (index !== -1) {
                this.deleteList.splice(index, 1);
            }
        }
    }

    quickModal() {
        if (this.guideModal === true) {
            $('#centralModalInfo').modal('show');
        }
        return this.guideModal = false;
    }
}

