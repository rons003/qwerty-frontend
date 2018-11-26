import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { ChallengeService } from '../challenges/shared/challenge.service';

import { Assignment } from './assignment.model';
import { Challenge } from '../challenges/shared/challenge.model';

/**
 * This class provides the Assignment service with methods to read assignments (homework).
 */
@Injectable()
export class AssignmentService {
  private assignments: Assignment[] = [];

  /**
   * Creates a new AssignmentService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(
    private http: HttpClient,
    private challengeService: ChallengeService
  ) {
    this.challengeService.getAllChallenges()
      .subscribe(
        (challenges: Challenge[]) => {
          challenges.map(
            (challenge: Challenge) => {
              const a = new Assignment();
              a.id = challenge.id;
              a.dateDue = new Date();
              a.challenge = challenge;
              this.assignments.push(a);
            }
          );
        },
        err => console.error(err)
      );
  }

  getAssignment(id: string): Observable<Assignment> {
    return new Observable(observer => {
      this
        .challengeService
        .getChallenge('1')
        .subscribe(
          (challenge: Challenge) => {
            const assignment = new Assignment();
            assignment.id = id;
            assignment.dateDue = new Date();
            assignment.challenge = challenge;
            //this.assignments[parseInt(id)];
            if (assignment) {
              observer.next(assignment);
              observer.complete();
            } else {
              observer.next(null);
              observer.complete();
            }
          }
        );
    });
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
