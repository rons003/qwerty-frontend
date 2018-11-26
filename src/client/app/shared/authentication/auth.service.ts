import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { UserService } from '../user.service';

import { User } from '../user.model';

import { Config } from '../../shared/config/env.config';

/**
 * This class provides the AuthService with methods to manage user authentication.
 */
@Injectable()
export class AuthService {
  redirectUrl: string;

  private authUrl = '';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options = { headers: this.headers };

  private user: User = null;

  /**
   * Creates a new AuthService with the injected Http.
   * @param {HttpClient} http - The injected Http.
   * @constructor
   */
  constructor(private http: HttpClient,
    private userService: UserService) {
    this.authUrl = Config.API_ENDPOINT;
  }

  /**
   * Attempts to log the user in with given username and password.
   * @param {string} username
   * @param {string} password
   * @return {Observable<User>} Observable containing requested user
   */
  login(username: string, password: string): Observable<User> {
    const body = {
      'data': {
        'username': username.toLowerCase(),
        'pwd': password
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.authUrl + '/signin';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map((res: any) => {
          // Returns username, id, token
          this.user = this.userService.processUserJson(res.user);
          this.saveCurrentUser(res.token, this.user);
          return res;
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    this.user = null;
    this.clearCurrentUser();
  }

  updateActiveUser(user: User) {
    const token = this.getCurrentUser().token;
    this.saveCurrentUser(token, user);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    const user = this.getActiveUser();
    return this.userService.changePassword(user.id, oldPassword, newPassword);
  }

  saveCurrentUser(token: any, user: User) {
    localStorage.setItem('currentUser', JSON.stringify({ token: token, user: user }));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  clearCurrentUser() {
    localStorage.setItem('currentUser', null);
  }

  isLoggedIn(): boolean {
    const data = this.getCurrentUser();
    return data && data.token;
  }

  isActiveUserStudent(): boolean {
    if (this.getCurrentUser()) {
      const user = this.getCurrentUser().user;
      return user && user.userType === 0;
    } else {
      return false;
    }
  }

  isActiveUserTeacher(): boolean {
    if (this.getCurrentUser()) {
      const user = this.getCurrentUser().user;
      return user && user.userType === 1;
    } else {
      return false;
    }
  }

  isActiveUserAdmin(): boolean {
    if (this.getCurrentUser()) {
      const user = this.getCurrentUser().user;
      return user && user.userType === 2;
    } else {
      return false;
    }
  }

  isActiveUserSuperAdmin(): boolean {
    if (this.getCurrentUser()) {
      const user = this.getCurrentUser().user;
      return user && user.userType === 3;
    } else {
      return false;
    }
  }

  getActiveUserName(): string {
    const user = this.getCurrentUser().user;
    return user.firstName + ' ' + user.lastName;
  }

  getActiveUser(): User {
    return User.parse(this.getCurrentUser().user);
  }

  getActiveUserPhoto(): string {
    if (this.isLoggedIn()) {
      return this.getCurrentUser().user.photoIcon;
    } else {
      return '';
    }
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
