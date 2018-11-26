import { Component, OnInit, AnimationKeyframesSequenceMetadata } from '@angular/core';
import { AuthService } from '../shared/authentication/auth.service';
import { SchoolService } from '../schools/school.service';
import { SectionService } from './section.service';
import { ModuleService } from '../modules/module.service';
import { Section } from './section.model';
import { School } from '../schools/school.model';
import { Module } from '../modules/module.model';
import { ActivatedRoute, Router } from '@angular/router';
import { isEmpty } from 'rxjs/operator/isEmpty';

declare var $: any; // jQuery

@Component({
    moduleId: module.id,
    selector: 'all-sections',
    templateUrl: 'sections.component.html',
    styleUrls: ['sections.component.css']
})
export class SectionsComponent implements OnInit {

    private school_id = '';
    private sections: Section[];
    private sectionList: Section[];
    private moduleList: Module;
    private schools: School[];
    private selectedSection: Section;
    private toggleCb = false;
    private clearSection: Section;
    private deleteList = new Array();
    private modules: Module;
    private moduleSection = false;
    private isChecked = false;
    private module_id = '';
    private isSchool = false;

    constructor(
        private authService: AuthService,
        private schoolService: SchoolService,
        private sectionService: SectionService,
        private moduleService: ModuleService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.clearSection = new Section();
        this.selectedSection = this.clearSection;
    }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe((params: any) => {
                if (params['id']) {
                    this.moduleSection = true;
                    this.modules = params;
                    this.module_id = params['id'];
                    this.getSectionFromModule(params['id']);
                } else if (params['schoolId']) {
                    this.getSection(params['schoolId']);
                    this.isSchool = true;
                } else {
                    this.isSchool = false;
                    this.moduleSection = false;
                    if (this.authService.isActiveUserSuperAdmin()) {
                        this.getAllSection();
                        this.getAllSchool();
                    } else if (this.authService.isActiveUserAdmin()) {
                        this.getSchool();
                    }
                }

            });
    }

    // deleteSectionFromModule(moduleId: string, sectionId: string[]) {
    //     this
    //         .moduleService
    //         .deleteSectionFromModule(moduleId, sectionId)
    //         .subscribe(
    //             (res: boolean) => {
    //                 if (res) {
    //                     this.getSectionFromModule(this.modules.id);
    //                 }
    //             }
    //         );
    // }

    getModule(module_id: string) {
        this
            .moduleService
            .getModules(module_id)
            .subscribe(
                (modules: Module) => {
                    this.getSectionList(modules);
                },
                err => console.error(err)
            );
    }

    getSectionList(module: Module) {
        this.sectionList = new Array();
        let i = 0;
        for (i = 0; i < module.sectionList.length; i++) {
            this.sectionService.getSection(module.sectionList[i].toString())
                .subscribe(
                    (sections: Section[]) => {
                        this.sectionList = [];
                        this.sectionList.push(sections[0]);
                    },
                    err => console.error(err)
                );
        }
    }

    listSectionModalShow() {
        this.getAllSection();
        $('#listSectionModal').modal('show');
    }

    addSectionToModule(moduleId: string, sectionId: string) {
        this
            .moduleService
            .addSectionToModule(moduleId, sectionId)
            .subscribe(
                (res: boolean) => {
                    this.getSectionFromModule(this.modules.id);
                }
            );
    }

    getSectionFromModule(moduleId: string) {
        this
            .sectionService
            .getSectionFromModule(moduleId)
            .subscribe(
                (sections: Section[]) => {
                    this.sectionList = [];
                    if (sections.length !== 0) {
                        this.sectionList = sections;
                    }
                }
            );
    }

    createSection(section: Section) {
        if (this.authService.isActiveUserAdmin()) {
            //section.school_id = this.school_id;
            this
                .sectionService
                .createSection(section)
                .subscribe(
                    (res: any) => {
                        this.getSection(this.school_id);
                    },
                    err => console.error('Unsuccessful: ' + err)
                );
        } else {
            //this.selectedSection.school_id = this.selectedSection.schoolId;
            this
                .sectionService
                .createSection(section)
                .subscribe(
                    (res: any) => {
                        if (res) {
                            this.getAllSection();
                        }
                    },
                    err => console.error('Unsuccessful: ' + err)
                );
        }
        this.clearSection = new Section();
        this.selectedSection = this.clearSection;
        $('#sectionModal').modal('hide');
    }

    getSection(school_id: string) {
        this
            .sectionService
            .getSectionUsingSchoolId(school_id)
            .subscribe(
                (sections: Section[]) => {
                    /*this.sections = [];
                    if (sections.length !== 0) {
                        this.sections = sections;
                        this.selectedSection = this.sections[0];
                        console.log(sections);
                    }*/
                    this.sections = sections;
                },
                err => console.error(err)
            );
    }

    getAllSection(searchText?: any) {
        if (searchText) {
            this.sectionService.searchSection(searchText)
                .subscribe(
                    (sections: Section[]) => {
                        this.sections = sections;
                    },
                    err => console.error(err)
                );
        } else {
            this.sectionService.getAllSection(0, 10)
                .subscribe(
                    (sections: Section[]) => {
                        if (this.moduleSection) {
                            this.sections = sections;
                        } else {
                            this.sections = sections;
                            this.selectedSection = this.sections[0];
                        }
                    },
                    err => console.error(err)
                );
        }
    }

    createNew() {
        this.selectedSection = this.clearSection;
        this.showModal();
    }

    getAllSchool() {
        this.schoolService.getAllSchools(0, 10)
            .subscribe(
                (schools: School[]) => {
                    this.schools = schools;
                },
                err => console.error(err)
            );
    }

    getSchool() {
        const activeUser = this.authService.getActiveUser();
        this
            .schoolService
            .getSchool(activeUser.id)
            .subscribe(
                (school_id: any) => {
                    this.school_id = school_id['school_id'];
                    this.getSection(this.school_id);
                },
                err => console.error(err)
            );
    }

    updateSection() {
        if (this.authService.isActiveUserAdmin()) {
            this
                .sectionService
                .updateSection(this.selectedSection)
                .subscribe(
                    (res: boolean) => {
                        this.getSection(this.school_id);
                    },
                    err => console.error('Unsuccessful: ' + err)
                );
        } else {
            this
                .sectionService
                .updateSection(this.selectedSection)
                .subscribe(
                    (res: boolean) => {
                        this.getAllSection();
                    },
                    err => console.error('Unsuccessful: ' + err)
                );
        }
        $('#sectionModal').modal('hide');
    }

    deleteSection() {
        if (this.deleteList.length !== 0) {
            if (this.moduleSection) {
                this
                    .moduleService
                    .deleteSectionFromModule(this.modules.id, this.deleteList)
                    .subscribe(
                        (res: any) => {
                            this.getSectionFromModule(this.modules.id);
                        },
                        err => console.error('Unsuccessful: ' + err)
                    );
            } else {
                this
                    .sectionService
                    .deleteSection(this.deleteList)
                    .subscribe(
                        (res: any) => {
                            //
                        },
                        err => console.error('Unsuccessful: ' + err)
                    );
            }
            const activeUser = this.authService.getActiveUser();
            if (this.authService.isActiveUserSuperAdmin()) {
                if (this.moduleSection) {
                    this.getModule(this.modules.id);
                } else {
                    this.getAllSection();
                }
            } else if (this.authService.isActiveUserAdmin()) {
                if (this.moduleSection) {
                    this.getModule(this.modules.id);
                } else {
                    this.getAllSection();
                }
                this.getSection(this.school_id);
            }
        }
        this.deleteList = new Array();
        $('.checkBoxTd').addClass('d-none');
        this.toggleCb = false;
    }

    onSubmit() {
        if (this.selectedSection.id) {
            this.updateSection();
        } else {
            this.createSection(this.selectedSection);
        }
    }

    showModal() {
        $('#sectionModal').modal('show');
    }

    select(section: Section) {
        this.selectedSection = section;
        this.showModal();
    }

    selectAll() {
        const selectedBox = $('.checkBoxes');
        this.isChecked = !this.isChecked;
        if (this.isChecked) {
            this.sections.forEach((section, i = 0) => {
                if (!this.deleteList.includes(section.id)) {
                    this.deleteList.push(section.id);
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

    deleteToggle(id: any, i: number) {
        $('.checkBoxTd').removeClass('d-none');
        this.toggleCb = true;
        const selectedBox = $('.checkBoxes');
        if (!this.deleteList.includes(id)) {
            this.deleteList.push(id);
            selectedBox[i].checked = true;
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

}
