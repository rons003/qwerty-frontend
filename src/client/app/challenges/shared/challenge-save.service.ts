import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { AuthService } from '../../shared/authentication/auth.service';

import { ChallengeSave } from './challenge-save.model';
import { User } from '../../shared/user.model';

import { Config } from '../../shared/config/env.config';

declare var humps: any;

/**
 * This class provides the ChallengeSave service with methods to read and save challenge states.
 */
@Injectable()
export class ChallengeSaveService {
  private savesUrl = '';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options = { headers: this.headers };

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this.savesUrl = Config.API_ENDPOINT;
  }

  getChallengeSaveForCurrentUser(challengeId: string): Observable<ChallengeSave> {
    const user = this.authService.getActiveUser();
    return this.getChallengeSaveForUserAndChallenge(user.id, challengeId);
  }

  setChallengeSaveForCurrentUser(challengeId: string, save: ChallengeSave): Observable<boolean> {
    const user = this.authService.getActiveUser();
    return this.setChallengeSaveForUserAndChallenge(user.id, challengeId, save);
  }

  /**
   * Returns the challenge save object for user and challenge if it exists.
   * Else, returns null.
   * @param {string} userId - Id of user
   * @param {string} challengeId - Id of challenge
   * @return {Observable<ChallengeSave>} Observable containing requested save
   */
  getChallengeSaveForUserAndChallenge(userId: string, challengeId: string): Observable<ChallengeSave> {
    const body = {
      'data': {
        'user_id': userId,
        'challenge_id': challengeId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.savesUrl + '/get_challenge_save_for_user_and_challenge';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => {
                      if (res.challenge_save) {
                          return this.processChallengeSaveJson(res.challenge_save);
                        }
                      }),
                      catchError(this.handleError)
                    );
  }

  /**
   * Sets the challenge save object for user and challenge.
   * @param {string} id - Id of user
   * @return {Promise<boolean>} Promise containing success of request
   */
  setChallengeSaveForUserAndChallenge(userId: string, challengeId: string, save: ChallengeSave): Observable<boolean> {
    const decamelSave = humps.decamelizeKeys(save);
    decamelSave['user_id'] = userId;
    decamelSave['challenge_id'] = challengeId;
    decamelSave['phaser_state'] = JSON.stringify(save.phaserState);

    const body = {
      'data': {
        'user_id': userId,
        'challenge_id': challengeId,
        'update_dict': decamelSave
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.savesUrl + '/set_challenge_save_for_user_and_challenge';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
      map((res: any) => {
        return true;
      }),
                      catchError(this.handleError)
                    );
  }

  processChallengeSaveJson(json: any): any {
    json['id'] = json['_id']['$oid']; // Has to be assigned before camelizeKeys
    const obj: any = humps.camelizeKeys(json);
    obj['phaserState'] = JSON.parse(obj['phaserState']);

    return ChallengeSave.parse(obj);
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
