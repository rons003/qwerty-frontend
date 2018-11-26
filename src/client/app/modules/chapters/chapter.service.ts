import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Config } from '../../shared/config/env.config';
import { Chapter } from './chapter.model';
import { ChapterItem } from './chapter-item.model';
declare var humps: any;

@Injectable()
export class ChapterService {
    private chapterUrl = '';
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) {
        this.chapterUrl = Config.API_ENDPOINT;
    }

    getChapterItemFromChapter(chapterId: string): Observable<ChapterItem[]> {
        const body = {
            'data': {
                'chapter_id': chapterId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/get_chapter_item_from_chapter';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniChapterItemJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    addChapterItemToChapter(chapterId: string, chapterItemId: string): Observable<boolean> {
        const body = {
            'data': {
                'chapter_id': chapterId,
                'chapter_item_id': chapterItemId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/add_chapter_item_to_chapter';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    deleteChapterItemFromChapter(chapterId: string, chapterItemId: string): Observable<boolean> {
        const body = {
            'data': {
                'chapter_id': chapterId,
                'chapter_item_id': chapterItemId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/delete_chapter_item_from_chapter';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    getAllChapterItem(offset: number, size: number): Observable<ChapterItem[]> {
        const requestUrl = this.chapterUrl + '/get_all_chapter_item/' + offset + '/' + size;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniChapterItemJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    createChapterItem(chapterItem: ChapterItem): Observable<string> {
        const body = {
            'data': chapterItem
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/create_chapter_item';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }

    updateChapterItem(chapterItem: ChapterItem): Observable<boolean> {
        const decamelizedChapterItem = humps.decamelizeKeys(chapterItem);

        const body = {
            'data': {
                'chapter_item_id': chapterItem.id,
                'update_dict': decamelizedChapterItem
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/update_chapter_item';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    deleteChapterItem(chapter_item_id: any[]): Observable<boolean> {

        const body = {
            'data': {
                'chapter_item_id': chapter_item_id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/delete_chapter_item';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    getAllChapter(offset: number, size: number): Observable<Chapter[]> {
        const requestUrl = this.chapterUrl + '/get_all_chapter/' + offset + '/' + size;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniChapterJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    createChapter(chapter: Chapter): Observable<string> {
        const body = {
            'data': chapter
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/create_chapter';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }

    updateChapter(chapter: Chapter): Observable<boolean> {
        const decamelizedModule = humps.decamelizeKeys(chapter);

        const body = {
            'data': {
                'chapter_id': chapter.id,
                'update_dict': decamelizedModule
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/update_chapter';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    deleteChapter(chapter_id: any[]): Observable<boolean> {

        const body = {
            'data': {
                'chapter_id': chapter_id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/delete_chapter';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    getChapterFromModule(moduleId: string): Observable<Chapter[]> {
        const body = {
            'data': {
                'module_id': moduleId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.chapterUrl + '/get_chapter_from_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniChapterJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    processMiniChapterItemJsonList(list: any[]): ChapterItem[] {
        return list.map(this.processMiniChapterItemJson);
    }

    processMiniChapterItemJson(json: any): any {
        const obj: any = humps.camelizeKeys(json);
        obj['id'] = obj['id']['$oid'];
        return Chapter.parse(obj);
    }

    processMiniChapterJsonList(list: any[]): Chapter[] {
        return list.map(this.processMiniChapterJson);
    }

    processMiniChapterJson(json: any): any {
        const obj: any = humps.camelizeKeys(json);
        obj['id'] = obj['id']['$oid'];
        return Chapter.parse(obj);
    }

    private getSuccessResponse(res: Response): boolean {
        return res.ok;
    }

    /**
    * Handle HTTP error
    */
    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return new ErrorObservable(errMsg);
    }

}
