import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Challenge } from './challenge.model';
import { Sprite } from './sprite.model';
import { SpriteBlocks } from './sprite-blocks.model';

import { Config } from '../../shared/config/env.config';

declare var humps: any;
/**
 * This class provides the Challenge service with methods to read challenges.
 */
@Injectable()
export class ChallengeService {
  private challengesUrl = '';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options = { headers: this.headers };
  /**
   * Creates a new ChallengeService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {
    this.challengesUrl = Config.API_ENDPOINT;
  }

  /**
   * Returns all existing challenges.
   * @return {Observable<Challenge[]>} Observable containing list of challenges
   */
  getAllChallenges(): Observable<Challenge[]> {
    const body = { 'data': { } };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.challengesUrl + '/get_challenges';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processChallengesJson(res.challenges)),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns the list of challenges belonging to a chapter.
   * @param {string} chapterId - Id of chapter
   * @return {Observable<Challenge[]>} Observable containing list of challenges
   */
  getChallengesForChapter(chapterId: string): Observable<Challenge[]> {
    const body = {
      'data': {
        'chapter_id': chapterId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.challengesUrl + '/get_challenges_from_chapter';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processChallengesJson(res.challenges)),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns the challenge with given id.
   * @param {string} id - Id of chapter
   * @return {Observable<Challenge>} Observable containing list of challenges
   */
  getChallenge(id: string): Observable<Challenge> {
    const body = {
      'data': {
        'challenge_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.challengesUrl + '/get_challenge';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processChallengeJson(res.challenge)),
                      catchError(this.handleError)
                    );
  }

  processChallengesJson(json: object): any {
    const challenges = json as Challenge[];
    return challenges.map(challenge => this.processChallengeJson(challenge));
  }

  /**
    * Converts json object into Challenge object.
    */
  processChallengeJson(json: any): any {
    if (!json) {
      return null;
    }

    try {
      json = JSON.parse(json);
    } catch (e) {
      // ignore
    }

    const obj: any = humps.camelizeKeys(json);
    obj['id'] = obj['id']['$oid'];

    return Challenge.parse(obj);
  }

  getRandomInArray(arr: string[]) {
    return arr[this.randomIntFromInterval(0, arr.length - 1)];
  }

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private buildMap(obj: any) {
    const map = new Map();
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });
    return map;
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
