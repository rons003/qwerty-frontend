import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { User } from '../shared/user.model';
import { Group } from '../groups/group.model';

import { Config } from '../shared/config/env.config';

declare var humps: any;

/**
 * This class provides the User service with methods to read Users who are students.
 */
@Injectable()
export class UserService {
  private usersUrl = '';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options = { headers: this.headers };

  constructor(private http: HttpClient) {
    this.usersUrl = Config.API_ENDPOINT;
  }

  /**
   * Completes given chapter for user.
   * @param {User} user - User object
   * @param {string} chapterId - Id of chapter
   * @return {Observable<boolean>} Observable containing success of request
   */
  completeChapterForUser(user: User, chapterId: string): Observable<boolean> {
    user.chapterProgress.set(chapterId, true);
    return this.updateUser(user);
  }

  /**
   * Completes given chapter item for user.
   * @param {User} user - User object
   * @param {string} chapterItemId - Id of chapter item
   * @return {Observable<boolean>} Observable containing success of request
   */
  completeChapterItemForUser(user: User, chapterItemId: string): Observable<boolean> {
    user.chapterItemProgress.set(chapterItemId, true);
    return this.updateUser(user);
  }

  /**
   * Completes given assignment for user.
   * @param {User} user - User object
   * @param {string} chapterId - Id of chapter
   * @return {Observable<boolean>} Observable containing success of request
   */
  completeAssignmentForUser(user: User, assignmentId: string): Observable<boolean> {
    user.assignmentProgress.set(assignmentId, true);
    return this.updateUser(user);
  }

  hasUserCompletedChapter(user: User, chapterId: string): boolean {
    return user.chapterProgress && user.chapterProgress.get(chapterId) === true;
  }

  hasUserCompletedChapterItem(user: User, chapterItemId: string): boolean {
    return user.chapterItemProgress && user.chapterItemProgress.get(chapterItemId) === true;
  }

  /**
   * Returns the user with given id, wrapped in a promise.
   * @param {string} id - Id of user
   * @return {Observable<User>} Observable containing requested user
   */
  getUser(id: string): Observable<User> {
    const body = {
      'data': {
        'user_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/get_user';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map((data: any) => {
          return this.processUserJson(data['user']);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Creates the given user object.
   * @param {User} user - User object
   * @return {Observable<boolean>} Observable containing success of request
   */
  createUser(user: User): Observable<boolean> {
    const decamelizedUser = humps.decamelizeKeys(user);
    const body = {
      'data': decamelizedUser
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/add_user';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map(this.getSuccessResponse),
        catchError(this.handleError)
      );
  }

  /**
   * Deletes the user with given id.
   * @param {string} id - Id of user to delete
   * @return {Observable<boolean>} Observable containing success of request
   */
  deleteUser(id: string): Observable<boolean> {
    const body = {
      'data': {
        'user_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/delete_user';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map(this.getSuccessResponse),
        catchError(this.handleError)
      );
  }

  /**
 * Retrieves Paginated Users.
 * @param {number} offset - Id of user to delete
 * @return {Observable<boolean>} Observable containing success of request
 */
  getAllUsers(offset: number, size: number): Observable<User[]> {
    const requestUrl = this.usersUrl + '/get_all_users/' + offset + '/' + size;
    return this.http.get(requestUrl, this.options)
      .pipe(
        map((data: any) => {
          return this.processMiniUserJsonList(data['data']);
        }),
        catchError(this.handleError)
      );
  }

  searchUser(searchText: string, searchType: string): Observable<User[]> {
    if (!searchText) {
      searchText = 'novalues';
    }
    const requestUrl = this.usersUrl + '/search_user/' + searchText + '/' + searchType;
    return this.http.get(requestUrl, this.options)
      .pipe(
        map((data: any) => {
          return this.processMiniUserJsonList(data['data']);
        }),
        catchError(this.handleError)
      );
  }

  searchUserType(searchType: string): Observable<User[]> {
    const requestUrl = this.usersUrl + '/search_usertype/' + searchType;
    return this.http.get(requestUrl, this.options)
      .pipe(
        map((data: any) => {
          return this.processMiniUserJsonList(data['data']);
        }),
        catchError(this.handleError)
      );
  }


  /**
   * Updates the given user.
   * @param {User} user - User object
   * @return {Observable<boolean>} Observable containing success of request
   */
  updateUser(user: User): Observable<boolean> {
    const timeJoined = user.dateJoined.getTime();
    const decamelizedUser = humps.decamelizeKeys(user);
    decamelizedUser['date_joined'] = timeJoined;
    decamelizedUser['chapter_progress'] = JSON.stringify(user.chapterProgress);
    decamelizedUser['assignment_progress'] = JSON.stringify(user.assignmentProgress);
    decamelizedUser['chapter_item_progress'] = JSON.stringify(user.chapterItemProgress);

    const body = {
      'data': {
        'user_id': user.id,
        'update_dict': decamelizedUser
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/update_user';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map(this.getSuccessResponse),
        catchError(this.handleError)
      );
  }

  /**
 * Updates the given user.
 * @param {User} user - User object
 * @return {Observable<boolean>} Observable containing success of request
 */
  updateUserAccount(user: User): Observable<boolean> {
    const decamelizedUser = humps.decamelizeKeys(user);

    const body = {
      'data': {
        'user_id': user.id,
        'update_dict': decamelizedUser
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/update_user_account';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map(this.getSuccessResponse),
        catchError(this.handleError)
      );
  }

  deleteSchool(user_id: string): Observable<boolean> {
    const body = {
      'data': {
        'user_id': user_id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/delete_school';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map(this.getSuccessResponse),
        catchError(this.handleError)
      );
  }

  resetPasswordForStudent(student: User): Observable<string> {
    const newPassword = this.generateRandomPasswordString();
    const body = {
      'data': {
        'user_id': student.id,
        'new_password': newPassword
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/reset_password';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map((res: Response) => {
          if (res.ok) {
            return <string>newPassword;
          } else {
            return '';
          }
        }),
        catchError(this.handleError)
      );
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<boolean> {
    const body = {
      'data': {
        'user_id': userId,
        'old_password': oldPassword,
        'new_password': newPassword
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/update_password';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map(this.getSuccessResponse),
        catchError(this.handleError)
      );
  }

  getFullNameForUser(user: User): string {
    return user.firstName + ' ' + user.lastName;
  }

  getStudentFromSection(section_id: string): Observable<User[]> {
    const body = {
      'data': {
        'section_id': section_id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/get_student_from_section';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map((data: any) => {
          return this.processUserJsonList(data['data']);
        }),
        catchError(this.handleError)
      );
  }

  getTeacherUsingSchool(school_id: string): Observable<User[]> {
    const body = {
      'data': {
        'school_id': school_id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/get_teacher_using_school';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map((data: any) => {
          return this.processUserJsonList(data['data']);
        }),
        catchError(this.handleError)
      );
  }

  getStudentFromSchool(school_id: string): Observable<User[]> {
    const body = {
      'data': {
        'school_id': school_id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.usersUrl + '/get_student_from_school';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map((data: any) => {
          return this.processUserJsonList(data['data']);
        }),
        catchError(this.handleError)
      );
  }

  getAllStudents(offset: number, size: number): Observable<User[]> {
        const requestUrl = this.usersUrl + '/get_all_students/' + offset + '/' + size;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniUserJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }
    searchStudentUser(searchText: string): Observable<User[]> {
        const requestUrl = this.usersUrl + '/search_studentuser/' + searchText;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniUserJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

  processUserJsonList(list: any[]): User[] {
    return list.map(this.processUserJson);
  }

  processUserJson(json: any): any {
    const obj: any = humps.camelizeKeys(json);
    obj['id'] = obj['id']['$oid'];
    obj['dateJoined'] = new Date(obj['dateJoined']);
    obj['chapterProgress'] = JSON.parse(obj['chapterProgress']);
    obj['chapterItemProgress'] = JSON.parse(obj['chapterItemProgress']);
    obj['assignmentProgress'] = JSON.parse(obj['assignmentProgress']);

    return User.parse(obj);
  }

  processMiniUserJsonList(list: any[]): User[] {
    return list.map(this.processMiniUserJson);
  }

  processMiniUserJson(json: any): any {
    const obj: any = humps.camelizeKeys(json);
    obj['id'] = obj['id']['$oid'];
    return User.parse(obj);
  }

  private getSuccessResponse(res: Response): boolean {
    return res.ok;
  }

  /**
   * Returns a randomly generated password string with variable length.
   * Referenced from: https://stackoverflow.com/a/9719815
   */
  private generateRandomPasswordString(): string {
    return Math.random().toString(36).slice(-8);
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
