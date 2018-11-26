import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/authentication/auth.service';
import { ChapterService } from './chapter.service';
import { ChapterItem } from './chapter-item.model';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any; // jQuery

@Component({
    moduleId: module.id,
    selector: 'cg-chapter-item',
    templateUrl: 'chapter-item.component.html',
    styleUrls: ['chapter-item.component.css']

})
export class ChapterItemComponent implements OnInit {
    private chapterItems: ChapterItem[];
    private chapterItem: ChapterItem;
    private selectedChapterItem: ChapterItem;
    private clearChapterItem: ChapterItem;
    private mainListChapterItem: ChapterItem[];
    private chapter_id: string;
    private toggleCb = false;
    private deleteList = new Array();
    private ChapterChapterItem = false;
    private typesOptionsSelect = [
        { value: 'slides', label: 'Slides' },
        { value: 'video', label: 'Video' },
        { value: 'challenge', label: 'Challenge' }
    ];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private chapterService: ChapterService
    ) {
        this.clearChapterItem = new ChapterItem();
        this.selectedChapterItem = this.clearChapterItem;
    }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe((params: any) => {
                if (params['id']) {
                    this.ChapterChapterItem = true;
                    this.chapterItem = params;
                    this.chapter_id = params['id'];
                    this.getChapterItemFromChapter(params['id']);
                    this.getAllChapterItem();
                } else {
                    this.ChapterChapterItem = false;
                    this.getAllChapterItem();
                }
            });
    }

    getChapterItemFromChapter(chapter_id: string) {
        this.chapterService
            .getChapterItemFromChapter(chapter_id)
            .subscribe(
                (chapterItems: ChapterItem[]) => {
                    this.mainListChapterItem = [];
                    if (chapterItems.length !== 0) {
                        this.mainListChapterItem = chapterItems;
                    }
                }
            );
    }

    addChapterItemToChapter(chapter_item_id: string) {
        this.chapterService
            .addChapterItemToChapter(this.chapter_id, chapter_item_id)
            .subscribe(
                (res) => {
                    this.getChapterItemFromChapter(this.chapterItem.id);
                }
            );
    }

    deleteChapterItemToChapter(chapter_item_id: string) {
        this.chapterService
            .deleteChapterItemFromChapter(this.chapter_id, chapter_item_id)
            .subscribe(
                (res) => {
                    this.getChapterItemFromChapter(this.chapterItem.id);
                }
            );
    }

    addChapterItem(chapterItem: ChapterItem) {
        this.chapterService
            .createChapterItem(chapterItem)
            .subscribe(
                (res: any) => {
                    this.getAllChapterItem();
                    this.hideModal();
                }
            );
    }

    getAllChapterItem() {
        this.chapterService
            .getAllChapterItem(0, 10)
            .subscribe(
                (chapterItems: ChapterItem[]) => {
                    this.chapterItems = [];
                    if (chapterItems.length !== 0) {
                        this.chapterItems = chapterItems;
                        this.selectedChapterItem = chapterItems[0];
                    }
                }
            );
    }

    updateChapterItem() {
        this
            .chapterService
            .updateChapterItem(this.selectedChapterItem)
            .subscribe(
                (res: any) => {
                    this.getAllChapterItem();
                    this.hideModal();
                }
            );

    }

    deleteChapterItem() {
        if (this.deleteList.length > 0) {
            this
                .chapterService
                .deleteChapterItem(this.deleteList)
                .subscribe(
                    (res: any) => {
                        console.log('Successfully Deleted');
                        this.getAllChapterItem();
                        this.hideModal();
                    }
                );
        }
        this.toggleCb = false;
    }

    onSubmit() {
        if (this.selectedChapterItem.id) {
            this.updateChapterItem();
        } else {
            this.addChapterItem(this.selectedChapterItem);
        }
    }

    createNewChapterItem() {
        this.selectedChapterItem = this.clearChapterItem;
        this.showModal();
    }

    select(chapterItem: ChapterItem) {
        this.selectedChapterItem = chapterItem;
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

    showModal() {
        $('#chaptermodal').modal('show');
    }

    hideModal() {
        $('#chaptermodal').modal('hide');
    }
}
