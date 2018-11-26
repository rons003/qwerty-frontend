import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { finalize } from 'rxjs/operators';

declare var $: any; //jquery

@Component({
    moduleId: module.id,
    selector: 'cg-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.css']

})
export class AccountComponent implements OnInit, AfterViewInit  {

    users: User[];
    selectedUser: User;
    clearUser: User;
    isLoading: true;
    userOptionsSelect = [
        { value: '0', label: 'Student'},
        { value: '1', label: 'Teacher' },
        { value: '2', label: 'School Admin' },
        { value: '3', label: 'Super Admin' }
    ];
    private searchType = 'all';
    private toggleCb = false;
    private isChecked = false;
    private deleteList = new Array();

    constructor(private userService: UserService) {
        this.clearUser = new User();
        this.selectedUser = this.clearUser;
    }

    ngOnInit() {
        this.getUsers();
    }

    showModal() {
        $('#modalContactForm').modal('show');
    }

    hideModal() {
        $('#modalContactForm').modal('hide');
    }

    getUsers(searchText?: any) {
        console.log('Get Users');
        if (searchText) {
            //console.log(searchText);
            this.userService.searchUser(searchText, this.searchType)
            .subscribe(
                (users: User[]) => {
                    this.users = users;
                },
                err => console.error(err)
            );
        } else if (!searchText && this.searchType !== 'all') {
            this.userService.searchUser(searchText, this.searchType)
            .subscribe(
                (users: User[]) => {
                    this.users = users;
                },
                err => console.error(err)
            );
        } else {
            this.userService.getAllUsers(0, 10)
            .subscribe(
            (users: User[]) => { this.users = users;
            },
                err => console.error(err)
            );
        }
    }

    getUserType(searchType = 'all') {
        this.searchType = searchType;
        if (searchType !== 'all') {
            //console.log(searchType);
            this.userService.searchUserType(searchType)
            .subscribe(
                (users: User[]) => {
                    this.users = users;
                },
                err => console.error(err)
            );
        } else {
            this.userService.getAllUsers(0, 10)
            .subscribe(
            (users: User[]) => { this.users = users;
            },
                err => console.error(err)
            );
        }
    }

    select(user: User) {
        this.selectedUser = user;
        this.showModal();
    }

    selectAll() {
        const selectedBox = $('.checkBoxes');
        this.isChecked = !this.isChecked;
        if (this.isChecked) {
            this.users.forEach((user, i = 0) => {
                if (!this.deleteList.includes(user.id)) {
                    this.deleteList.push(user.id);
                    selectedBox[i].checked = true;
                }
            });
        } else {
            for (let i = 0; i < selectedBox.length; i++) {
                selectedBox[i].checked = false;
            }
            this.deleteList = new Array();
        }

    }

    createNewUser() {
        this.selectedUser = this.clearUser;
        this.selectedUser.username = '';
        this.selectedUser.pwd = '';
        this.showModal();
    }
    onSubmit() {

        if (this.selectedUser.id) {
            this.userService.updateUserAccount(this.selectedUser)
                .subscribe((res: boolean) => console.log(res),
                    err => console.error(err)
                );
        } else {
            this.userService.createUser(this.selectedUser)
                .subscribe((res: boolean) => {
                    this.selectedUser.pwd = '';
                    this.users.push(this.selectedUser);
                    this.clearUser = new User();
                },
                    err => console.error(err)
                );
                this.getUsers();
        }

        this.selectedUser.pwd = '';
        this.selectedUser = this.clearUser;
        this.hideModal();
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
    checkforDelete(id: any) {
        if (!this.deleteList.includes(id)) {
            this.deleteList.push(id);
        } else {
            const index: number = this.deleteList.indexOf(id);
            if (index !== -1) {
                this.deleteList.splice(index, 1);
            }
        }
    }

    deleteUser() {
         let id = '';
         for (id of this.deleteList) {
             this
                 .userService
                 .deleteUser(id)
                 .subscribe(
                     (res: any) => {
                         //
                     },
                     err => console.error('Unsuccessful: ' + err)
                 );
         }
         this.deleteList = new Array();
         $('.checkBoxTd').addClass('d-none');
         this.toggleCb = false;
         this.getUsers();
     }

    ngAfterViewInit() {
        //$('.mdb-select').material_select();
        console.log('endinit');
    }


}
