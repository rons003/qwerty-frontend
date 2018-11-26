import { Component, OnInit } from '@angular/core';
import { ModuleService } from './module.service';
import { AuthService } from '../shared/authentication/auth.service';
import { SchoolService } from '../schools/school.service';
import { UserService } from '../shared/user.service';
import { Module } from './module.model';
import { School } from '../schools/school.model';
import { User } from '../shared/user.model';
import { isEmpty } from 'rxjs/operators';
declare var $: any; // jQuery

@Component({
    moduleId: module.id,
    selector: 'cg-modules',
    templateUrl: 'modules.component.html',
    styleUrls: ['modules.component.css']

})
export class ModulesComponent implements OnInit {
    private school_id = '';
    private modules: Module[];
    private schools: School[];
    private selectedModule: Module;
    private toggleCb = false;
    private guideModal = true;
    private clearModule: Module;
    private deleteList = new Array();
    private teachers: User[];

    constructor(
        private authService: AuthService,
        private moduleService: ModuleService,
        private schoolService: SchoolService,
        private userService: UserService
    ) {
        this.clearModule = new Module();
        this.selectedModule = this.clearModule;
    }
    moduleModal() {
        $('#moduleModal').modal('show');
    }
    /**
   * OnInit
   */
    ngOnInit() {
        const activeUser = this.authService.getActiveUser();
        if (this.authService.isActiveUserSuperAdmin()) {
            this.getAllModule();
            this.getSchools();
        } else if (this.authService.isActiveUserAdmin() || this.authService.isActiveUserTeacher()) {
            this
                .schoolService
                .getSchool(activeUser.id)
                .subscribe(
                    (school_id: any) => {
                        this.school_id = school_id['school_id'];
                        this.getModule(this.school_id);
                    },
                    err => console.error(err)
                );
        }

    }

    getSchools() {
        this.schoolService.getAllSchools(0, 10)
            .subscribe(
                (schools: School[]) => {
                    this.schools = schools;
                },
                err => console.error(err)
            );
    }

    getModule(school_id: string) {
        this.school_id = school_id;
        this
            .moduleService
            .getModulesUsingSchoolId(school_id)
            .subscribe(
                (modules: Module[]) => {
                    this.modules = [];
                    this.getTeacherUsingSchool(school_id);
                    if (modules.length !== 0) {
                        this.modules = modules;
                        this.selectedModule = this.modules[0];
                    }
                },
                err => console.error(err)
            );
    }

    getAllModule() {
        this.moduleService.getAllModules(0, 10)
            .subscribe(
                (modules: Module[]) => {
                    this.modules = [];
                    if (modules.length !== 0) {
                        this.modules = modules;
                        this.selectedModule = this.modules[0];
                    }
                },
                err => console.error(err)
            );
    }

    getTeacherUsingSchool(school_id: string) {
        this
            .userService
            .getTeacherUsingSchool(school_id)
            .subscribe(
                (teachers: User[]) => {
                    this.teachers = [];
                    this.teachers = teachers;
                }
            );
    }

    addModule(module: Module) {
        module.school_id = this.school_id;
        this
            .moduleService
            .createModule(module)
            .subscribe(
                (res: any) => {
                    if (res) {
                        this.getAllModule();
                    }
                },
                err => console.error('Unsuccessful: ' + err)
            );
        this.clearModule = new Module();
        this.selectedModule = this.clearModule;
        $('#moduleModal').modal('hide');
    }

    deleteModule() {
        if (this.deleteList.length !== 0) {
            this
                .moduleService
                .deleteModule(this.deleteList)
                .subscribe(
                    (res: any) => {
                        this.getAllModule();
                    },
                    err => console.error('Unsuccessful: ' + err)
                );
        }
        const activeUser = this.authService.getActiveUser();
        if (this.authService.isActiveUserSuperAdmin()) {
            this.getAllModule();
        } else if (this.authService.isActiveUserAdmin()) {
            this.getModule(this.school_id);
        }
        this.deleteList = new Array();
        this.toggleCb = false;
    }

    createNewModule() {
        this.selectedModule = this.clearModule;
        this.moduleModal();
    }

    onSubmit() {
        if (this.selectedModule.id) {
            this.updateModule();
        } else {
            this.addModule(this.selectedModule);
        }
    }

    updateModule() {
        if (this.authService.isActiveUserAdmin()) {
            this
                .moduleService
                .updateModule(this.selectedModule)
                .subscribe(
                    (res: boolean) => {
                        this.getModule(this.school_id);
                    },
                    err => console.error('Unsuccessful: ' + err)
                );
        } else {
            this
                .moduleService
                .updateModule(this.selectedModule)
                .subscribe(
                    (res: boolean) => {
                        this.getAllModule();
                    },
                    err => console.error('Unsuccessful: ' + err)
                );
        }
        $('#moduleModal').modal('hide');
    }

    select(module: Module) {
        this.selectedModule = module;
        this.moduleModal();
    }

    deleteToggle() {
        this.toggleCb = true;
    }

    quickModal() {
        if (this.guideModal === true) {
            $('#centralModalInfo').modal('show');
        }
        return this.guideModal = false;
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
}
