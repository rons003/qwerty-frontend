import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/observable/forkJoin';

import { Chapter } from './chapter.model';
import { ChapterItem } from './chapter-item.model';
import { Challenge } from '../challenges/shared/challenge.model';

import { Config } from '../shared/config/env.config';

declare var humps: any;
/**
 * This class provides the Chapter service with methods to get, update, and delete
 * chapters.
 */
@Injectable()
export class ChapterService {
  private chaptersUrl = '';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options = { headers: this.headers };

  /**
   * Creates a new ChapterService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {
    this.chaptersUrl = Config.API_ENDPOINT;
  }

  /**
   * Returns all chapters, wrapped in an Observable.
   * @return {Observable<Chapter[]>} Observable containing list of Chapters
   */
  getAllChapters(): Observable<Chapter[]> {
    const body = {
      'data': { }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/get_chapters';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => res.chapters),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns chapter with given id, wrapped in an Observable.
   * @param {number} id - Id for chapter to get
   * @return {Observable<Chapter>} Observable containing Chapter
   */
  getChapter(id: string): Observable<Chapter> {
    const body = {
      'data': {
        'chapter_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/get_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processChapterJson(res.chapter)),
                      catchError(this.handleError)
                    );
  }

  getChapterWithObjects(id: string): Observable<Chapter> {
    const bodyString = JSON.stringify({
      'data': {
        'chapter_id': id
      }
    });

    return Observable
             .forkJoin([
               this.http.post(this.chaptersUrl + '/get_chapter', bodyString, this.options),
               this.http.post(this.chaptersUrl + '/get_chapter_item_objects_list', bodyString, this.options)
             ])
             .pipe(
               map((data: any[]) => {
                 const chapter: Chapter = this.processChapterJson(data[0].chapter);
                 const chapterItems: ChapterItem[] = this.processChapterItemListJson(data[1].chapter_items);
                 chapter.chapterItems = chapterItems;
                 return chapter;
               }),
               catchError(this.handleError)
             );
  }

  /**
   * Returns chapter items for given chapter, wrapped in an Observable.
   * @param {number} id - Id for chapter to get
   * @return {Observable<Challenge[]>} Observable containing list of challenges
   */
  getChapterItemsForChapter(id: string): Observable<Challenge[]> {
    const body = {
      'data': {
        'chapter_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/get_chapter_item_objects_list';
    console.log(requestUrl);
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processChapterItemListJson(res['chapter_items'])),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns challenges for given chapter, wrapped in an Observable.
   * @param {number} id - Id for chapter to get
   * @return {Observable<Challenge[]>} Observable containing list of challenges
   */
  getChallengesFromChapter(id: string): Observable<Challenge[]> {
    const body = {
      'data': {
        'chapter_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/get_challenges_from_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => res.challenges),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns challenge from given chapter, wrapped in an Observable.
   * @param {number} chapterId - Id for chapter to get from
   * @param {number} challengeId - Id for challenge to get
   * @return {Observable<Challenge>} Observable containing Challenge
   */
  getChallengeFromChapter(chapterId: string, challengeId: string): Observable<Challenge> {
    const body = {
      'data': {
        'chapter_id': chapterId,
        'challenge_id': challengeId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/get_challenge_from_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => res.challenge),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of creating chapter, wrapped in a Observable.
   * @param {Chapter} chapter - Chapter object to create
   * @return {Observable<boolean>} Observable containing success of request
   */
  createChapter(chapter: Chapter): Observable<boolean> {
    const body = {
      'data': chapter
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/create_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => res.chapter),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of deleting chapter, wrapped in a Observable.
   * @param {number} chapterId - Id for chapter to delete
   * @return {Observable<boolean>} Observable containing success of request
   */
  deleteChapter(id: string): Observable<boolean> {
    const body = {
      'data': {
        'chapter_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/delete_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of updating chapter, wrapped in a Observable.
   * @param {Chapter} chapter - Updated Chapter object
   * @return {Observable<boolean>} Observable containing success of request
   */
  updateChapter(chapter: Chapter): Observable<boolean> {
    const body = {
      'data': {
        'chapter_id': chapter.id,
        'update_dict': chapter
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/update_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of adding challenge to chapter, wrapped in a Observable.
   * @param {number} chapterId - Id for chapter to add to
   * @param {number} challengeId - Id for challenge to add
   * @return {Observable<boolean>} Observable containing success of request
   */
  addChallengeToChapter(chapterId: string, challengeId: string): Observable<boolean> {
    const body = {
      'data': {
        'chapter_id': chapterId,
        'challenge_id': challengeId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/add_challenge_to_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of deleting challenge from chapter, wrapped in a Observable.
   * @param {number} chapterId - Id for chapter to delete from
   * @param {number} challengeId - Id for challenge to delete
   * @return {Observable<boolean>} Observable containing success of request
   */
  deleteChallengeFromChapter(chapterId: string, challengeId: string): Observable<boolean> {
    const body = {
      'data': {
        'chapter_id': chapterId,
        'challenge_id': challengeId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.chaptersUrl + '/delete_challenge_from_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  processChapterListJson(list: any[]): Chapter[] {
    return list.map((chapter) => {
      return this.processChapterJson(chapter);
    });
  }

  processChapterJson(json: any): Chapter {
    try {
      json = JSON.parse(json);
    } catch (e) {
      // ignore
    }
    const obj: any = humps.camelizeKeys(json);
    obj['id'] = obj['id']['$oid'];

    return Chapter.parse(obj);
  }

  processChapterItemListJson(list: any[]): ChapterItem[] {
    return list.map(this.processChapterItemJson);
  }

  processChapterItemJson(json: any): ChapterItem {
    const obj: any = humps.camelizeKeys(json);
    obj['id'] = obj['id']['$oid'];
    obj['type'] = obj['itemType'];

    return ChapterItem.parse(obj);
  }

  private getJsonResponse(res: Response): any {
    return res.json();
  }

  private getSuccessResponse(res: Response): any {
    return res.ok;
  }

  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return new ErrorObservable(errMsg);
  }
}
