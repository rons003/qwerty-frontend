import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterService } from './chapter.service';
import { SchoolService } from '../../schools/school.service';
import { ModuleService } from '../module.service';
import { Chapter } from './chapter.model';
import { Module } from '../module.model';
import { School } from '../../schools/school.model';

declare var $: any; // jQuery

@Component({
    moduleId: module.id,
    selector: 'cg-chapters',
    templateUrl: 'chapters.component.html',
    styleUrls: ['chapters.component.css']

})
export class ChaptersComponent implements OnInit {
    private chapters: Chapter[];
    private selectedChapter: Chapter;
    private clearChapter: Chapter;
    private modules: Module[];
    private toggleCb = false;
    private deleteList = new Array();
    private moduleChapter = false;
    private chapterFromModule: Chapter[];
    private schools: School[];
    private module_id = '';

    constructor(
        private chapterService: ChapterService,
        private route: ActivatedRoute,
        private schoolService: SchoolService,
        private moduleService: ModuleService,
        private authService: AuthService,
        private router: Router
    ) {
        this.clearChapter = new Chapter();
        this.selectedChapter = this.clearChapter;
    }

    showModal() {
        $('#chapterModal').modal('show');
    }

    hideModal() {
        $('#chapterModal').modal('hide');
    }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe((params: any) => {
                if (params['id']) {
                    this.moduleChapter = true;
                    this.modules = params;
                    this.module_id = params['id'];
                    this.getChapterFromModule(params['id']);
                } else {
                    this.moduleChapter = false;
                    this.getChapter();
                }

            });
    }

    listChapterModalShow() {
        $('#list-chapter-modal').modal('show');
        this.getChapter();
    }

    getChapterFromModule(module_id: string) {
        this
            .chapterService
            .getChapterFromModule(module_id)
            .subscribe(
                (chapters: Chapter[]) => {
                    this.chapterFromModule = [];
                    if (chapters.length !== 0) {
                        this.chapterFromModule = chapters;
                    }
                }
            );
    }

    addChapterToModule(module_id: string, chapter_id: string) {
        this
            .moduleService
            .addChapterToModule(module_id, chapter_id)
            .subscribe(
                (res: any) => {
                    this.getChapterFromModule(this.module_id);
                }
            );
    }

    deleteChapterFromModule(module_id: string, chapter_ids: string[]) {
        this
            .moduleService
            .deleteChapterFromModule(module_id, chapter_ids)
            .subscribe(
                (res: any) => {
                    this.getChapterFromModule(this.module_id);
                }
            );
    }


    getAllSchool() {
        this.schoolService.getAllSchools(0, 10)
            .subscribe(
                (schools: School[]) => {
                    this.schools = [];
                    this.schools = schools;
                },
                err => console.error(err)
            );
    }

    getAllModules() {
        this.moduleService.getAllModules(0, 10)
            .subscribe(
                (modules: Module[]) => {
                    this.modules = [];
                    this.modules = modules;
                },
                err => console.error(err)
            );
    }

    createChapter(chapter: Chapter) {
        this
            .chapterService
            .createChapter(chapter)
            .subscribe(
                (res: any) => {
                    this.getChapter();
                    this.hideModal();
                }
            );
    }

    getChapter() {
        this
            .chapterService
            .getAllChapter(0, 10)
            .subscribe(
                (chapters: Chapter[]) => {
                    this.chapters = [];
                    if (chapters.length !== 0) {
                        this.chapters = chapters;
                        this.selectedChapter = chapters[0];
                    }
                }
            );
    }

    deleteChapter() {
        if (this.deleteList.length > 0) {
            if (!this.moduleChapter) {
                this
                    .chapterService
                    .deleteChapter(this.deleteList)
                    .subscribe(
                        (res: any) => {
                            console.log('Successfully Deleted');
                            this.getChapter();
                        }
                    );
            } else {
                this
                    .moduleService
                    .deleteChapterFromModule(this.module_id, this.deleteList)
                    .subscribe(
                        (res: any) => {
                            console.log('Successfully Deleted');
                            this.getChapterFromModule(this.module_id);
                        }
                    );
            }
        }
        this.toggleCb = false;
    }

    updateChapter() {
        this
            .chapterService
            .updateChapter(this.selectedChapter)
            .subscribe(
                (res: any) => {
                    this.getChapter();
                    $('#chapterModal').modal('hide');
                }
            );

    }

    onSubmit() {
        if (this.selectedChapter.id) {
            this.updateChapter();
        } else {
            this.createChapter(this.selectedChapter);
        }
    }

    createNewChapter() {
        this.selectedChapter = this.clearChapter;
        this.showModal();
    }

    select(chapter: Chapter) {
        this.selectedChapter = chapter;
        this.showModal();
    }

    deleteToggle() {
        this.toggleCb = true;
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

