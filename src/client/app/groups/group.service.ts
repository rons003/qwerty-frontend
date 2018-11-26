import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/observable/forkJoin';

import { AuthService } from '../shared/authentication/auth.service';
import { UserService } from '../shared/user.service';
import { ChapterService } from '../chapters/chapter.service';
import { ChallengeService } from '../challenges/shared/challenge.service';

import { Group } from './group.model';
// import { Assignment } from './assignment.model';
import { Chapter } from '../chapters/chapter.model';
import { Challenge } from '../challenges/shared/challenge.model';
import { User } from '../shared/user.model';

import { Config } from '../shared/config/env.config';

declare var humps: any;

/**
 * This class provides the Group service with methods to read groups (classes).
 */
@Injectable()
export class GroupService {
  private groupsUrl = '';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options = { headers: this.headers };

  /**
   * Creates a new GroupService with the injected Http.
   * @param {HttpClient} http - The injected Http.
   * @constructor
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private chapterService: ChapterService,
    // private challengeService: ChallengeService
  ) {
    this.groupsUrl = Config.API_ENDPOINT;
  }

  /**
   * Returns the group with given id wrapped in a Observable.
   * @param {string} id - Id for group to get
   * @return {Observable<Group>} Observable containing json of request
   */
  getGroup(id: string): Observable<Group> {
    const body = {
      'data': {
        'group_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/get_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processGroupJson(res.group)),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns the group with given id, with objects initialised, wrapped in a Observable.
   * @param {string} id - Id for group to get
   * @return {Observable<Group>} Observable containing json of request
   */
  getGroupWithObjects(id: string): Observable<Group> {
    const groupReq = { 'group_id': id };
    const studentReq = { 'group_id': id, 'user_type': 0 };
    const adminReq = { 'group_id': id, 'user_type': 1 };

    const groupReqBody = JSON.stringify({ 'data': groupReq });
    const studentReqBody = JSON.stringify({ 'data': studentReq });
    const adminReqBody = JSON.stringify({ 'data': adminReq });

    return Observable
             .forkJoin([
               this.http.post(this.groupsUrl + '/get_group', groupReqBody, this.options),
               this.http.post(this.groupsUrl + '/get_user_objects_list', studentReqBody, this.options),
               this.http.post(this.groupsUrl + '/get_user_objects_list', adminReqBody, this.options),
               this.http.post(this.groupsUrl + '/get_chapter_objects_list', groupReqBody, this.options),
               this.http.post(this.groupsUrl + '/get_assignment_objects_list', groupReqBody, this.options)])
             .pipe(
               map((data: any[]) => {
                 const groupJson = data[0].group;
                 const group: Group = this.processGroupJson(groupJson);
                 group.students = this.userService.processUserJsonList(data[1].data);
                 group.admins = this.userService.processUserJsonList(data[2].data);
                 group.chapters = this.chapterService.processChapterListJson(data[3].data);
                 // group.assignments = this.processAssignmentJsonList(data[4].data);
                 return group;
               }),
               catchError(this.handleError)
             );
  }

  /**
   * Returns the groups that user with given id is in, wrapped in a Observable.
   * @param {string} id - Id of user
   * @return {Observable<string[]>} Observable containing list of group ids as strings
   */
  getGroupsForUserId(id: string): Observable<string[]> {
    const body = {
      'data': {
        'user_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/get_user_groups';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => res.groups),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns the group with given id wrapped in a Observable.
   * @param {string} id - Id for chapter to get
   * @return {Observable<Group>} Observable containing json of request
   */
  getUsersFromGroup(id: string): Observable<User[]> {
    const body = {
      'data': {
        'group_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/get_user_objects_list';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => res.users),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns the user with given userId in given group wrapped in a Observable.
   * @param {string} groupId - Id of group to get from
   * @param {userId} userId - Id of user to get
   * @return {Observable<User>} Observable containing user
   */
  getUserFromGroup(groupId: string, userId: string): Observable<User> {
    const body = {
      'data': {
        'group_id': groupId,
        'user_id': userId,
        'list_type': 0
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/get_user_from_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => res.user),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of creating given Group object.
   * @param {Group} group - Group object to create
   * @return {Observable<boolean>} Observable containing success of request
   */
  createGroup(group: Group): Observable<boolean> {
    const body = {
      'data': {
        'group_dict': group,
        'creator_id': this.authService.getActiveUser().id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/create_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of deleting group with given id.
   * @param {string} id - Id for group to delete
   * @return {Observable<boolean>} Observable containing success of request
   */
  deleteGroup(id: string): Observable<boolean> {
    const body = {
      'data': {
        'group_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/delete_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of updating given Group object.
   * @param {Group} group - Updated Group object
   * @return {Observable<boolean>} Observable containing success of request
   */
  updateGroup(groupId: string, group: any): Observable<boolean> {
    const decamelGroup = humps.decamelizeKeys(group);
    decamelGroup['visible_chapters'] = group.visibleChapters;

    const body = {
      'data': {
        'group_id': groupId,
        'update_dict': decamelGroup
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/update_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Changes visibility of the given chapter for the given group.
   * @param {string} group - Group to change
   * @param {string} chapterId - Id of chapter to toggle
   * @return {Observable<boolean>} Observable containing success of request
   */
  toggleVisibilityOfChapter(group: Group, chapterId: string): Observable<Group> {
    if (group.visibleChapters.get(chapterId)) {
      group.visibleChapters.set(chapterId, null);
    } else {
      group.visibleChapters.set(chapterId, true);
    }

    const updateGroup = {
      groupId: group.id,
      visibleChapters: group.visibleChapters
    };

    return this
             .updateGroup(group.id, updateGroup)
             .pipe(
               map(success => success ? group : null),
               catchError(this.handleError)
             );
  }

  /**
   * Returns success of adding chapter with given id to group with given group id.
   * @param {string} groupId - Id of group to add to
   * @param {string} chapterId - Id of chapter to add
   * @return {Observable<boolean>} Observable containing success of request
   */
  addChapterToGroup(groupId: string, chapterId: string): Observable<boolean> {
    const body = {
      'data': {
        'group_id': groupId,
        'chapter_id': chapterId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/add_chapter_to_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of deleting chapter with given id from group with given
   * group id.
   * @param {string} groupId - Id of group to delete from
   * @param {string} chapterId - Id of chapter to delete
   * @return {Observable<boolean>} Observable containing success of request
   */
  deleteChapterFromGroup(groupId: string, chapterId: string): Observable<boolean> {
    const body = {
      'data': {
        'group_id': groupId,
        'chapter_id': chapterId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/delete_chapter_from_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of adding user with given id to group.
   * @param {string} groupId - Id of group to delete from
   * @param {string} userId - Id of user to add
   * @return {Observable<boolean>} Observable containing success of request
   */
  addUserToGroup(groupId: string, userId: string): Observable<boolean> {
    const body = {
      'data': {
        'group_id': groupId,
        'to_be_added_id': userId,
        'adder_id': this.authService.getActiveUser().id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/add_user_to_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of deleting user with given id from group.
   * @param {string} groupId - Id of group to delete from
   * @param {string} userId - Id of user to delete
   * @return {Observable<boolean>} Observable containing success of request
   */
  deleteUserFromGroup(groupId: string, userId: string): Observable<boolean> {
    const body = {
      'data': {
        'group_id': groupId,
        'to_be_added_id': userId,
        'adder_id': this.authService.getActiveUser().id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/delete_user_from_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of activating user with given id in group.
   * @param {string} groupId - Id of group
   * @param {string} userId - Id of user to activate
   * @return {Observable<boolean>} Observable containing success of request
   */
  activateUserInGroup(groupId: string, userId: string): Observable<boolean> {
    const body = {
      'data': {
        'group_id': groupId,
        'user_id': userId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/activate_user_in_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of deactivating user with given id in group.
   * @param {string} groupId - Id of group
   * @param {string} userId - Id of user to deactivate
   * @return {Observable<boolean>} Observable containing success of request
   */
  deactivateUserInGroup(groupId: string, userId: string): Observable<boolean> {
    const body = {
      'data': {
        'group_id': groupId,
        'user_id': userId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.groupsUrl + '/deactivate_user_in_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map(this.getSuccessResponse),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns success of adding assignment to group.
   * @param {string} groupId - Id of group
   * @param {Assignment} assignment - Assignment to add
   * @return {Observable<boolean>} Observable containing success of request
   */
  // addAssignmentToGroup(groupId: string, assignment: Assignment): Observable<boolean> {
  //   const body = {
  //     'data': {
  //       'group_id': groupId,
  //       'assignment_dict': humps.decamelizeKeys(assignment)
  //     }
  //   };
  //   const bodyString = JSON.stringify(body);
  //   const requestUrl = this.groupsUrl + '/add_assignment_to_group';
  //   return this.http.post(requestUrl, bodyString, this.options)
  //                   .pipe(
  //                     map(this.getSuccessResponse),
  //                     catchError(this.handleError)
  //                   );
  // }

  /**
   * Returns success of removing assignment from group.
   * @param {string} groupId - Id of group
   * @param {string} assignmentId - Id of assignment to remove
   * @return {Observable<boolean>} Observable containing success of request
   */
  // removeAssignmentFromGroup(groupId: string, assignmentId: string): Observable<boolean> {
  //   const body = {
  //     'data': {
  //       'group_id': groupId,
  //       'assignmentId': assignmentId
  //     }
  //   };
  //   const bodyString = JSON.stringify(body);
  //   const requestUrl = this.groupsUrl + '/remove_assignment_from_group';
  //   return this.http.post(requestUrl, bodyString, this.options)
  //                   .pipe(
  //                     map(this.getSuccessResponse),
  //                     catchError(this.handleError)
  //                   );
  // }

  isChapterVisible(group: Group, chapter: Chapter): boolean {
    return group.visibleChapters.get(chapter.id) !== null;
  }

  processGroupJsonList(list: any): Group[] {
    return list.map((json: any) => this.processGroupJson(json));
  }

  processGroupJson(json: any): any {
    const obj: any = humps.camelizeKeys(JSON.parse(json));
    obj['id'] = obj['id']['$oid'];
    obj['dateCreated'] = new Date(obj['dateCreated']);

    return Group.parse(obj);
  }

  // processAssignmentJsonList(list: any): Assignment[] {
  //   return list.map((json: any) => this.processAssignmentJson(json));
  // }

  // processAssignmentJson(json: any): Assignment {
  //   const obj: any = humps.camelizeKeys(json);
  //   obj['id'] = obj['id']['$oid'];
  //   obj['dateCreated'] = new Date(obj['dateCreated']);

  //   return Assignment.parse(obj);
  // }

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
