import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Challenge } from './challenge.model';
import { Sprite } from './sprite.model';
import { SpriteBlocks } from './sprite-blocks.model';

declare var humps: any;

/**
 * This class provides the Challenge service with methods to read challenges.
 */
@Injectable()
export class LocalChallengeService {

  /**
   * Creates a new ChallengeService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {Observable<string[]>} The Observable for the HTTP request.
   */
  getChallenges(): Observable<Challenge[]> {
    return this.http.get('assets/data.json')
                    .pipe(
                      map((res: any) => this.processChallengesJson(res)),
                      catchError(this.handleError)
                    );
  }

  getChallengesForChapter(chapterId: number): Observable<Challenge[]> {
    return this.http.get('assets/data.json')
                    .pipe(
                      map((res: any) => this.processChallengesJson(res.slice(0, 2))),
                      catchError(this.handleError)
                    );
  }

  getChallenge(id: number): Observable<Challenge> {
    return this.http.get('assets/data.json')
                    .pipe(
                      map((res: any) => this.processChallengeJson(res.id)),
                      catchError(this.handleError)
                    );
  }

  processChallengesJson(json: object): any {
    const challenges = json as Challenge[];
    return challenges.map((challenge, index) => this.processChallengeJson(challenge, index));
  }

  /**
    * Converts json object into Challenge object.
    */
  processChallengeJson(json: object, index?: number) {
    if (!json) {
      return null;
    }

    const obj: any = humps.camelizeKeys(json);
    const challenge = Object.assign(new Challenge(), obj);

    if (index) {
      challenge.id = '' + index;
      challenge.nextChallengeId = '' + (index + 1);
    }

    if (challenge.gifUrl) {
      challenge.gifUrl = challenge.gifUrl.substring(1);
    }

    challenge.sprites = challenge.sprites.map(function(sprite: object) {
      return Object.assign(new Sprite(), sprite);
    });
    challenge.correctPatterns = this.buildMap(challenge.correctPatterns);
    return challenge;
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
