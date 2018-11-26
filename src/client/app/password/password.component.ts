import { Component } from '@angular/core';

import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { AuthService } from '../shared/authentication/auth.service';

declare var $: any; //jquery

@Component({
    moduleId: module.id,
    selector: 'cg-password',
    templateUrl: 'password.component.html',
    styleUrls: ['password.component.css']

})
export class PasswordComponent {
    selectedUser: User;
    clearUser: User;
    activeUser: any;
    oldPassword: string;
    newPassword: string;

    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {
        this.clearUser = new User();
        this.selectedUser = this.clearUser;
        this.activeUser = this.authService.getActiveUser();
    }

    onSubmit() {
            this
            .userService
            .changePassword(this.activeUser.id, this.oldPassword, this.newPassword)
            .subscribe((res: boolean) => console.log(res),
                    err => console.error(err)
            );
    }
}
