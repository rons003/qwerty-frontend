import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { AuthService } from '../shared/authentication/auth.service';
import { UserService } from '../shared/user.service';

import { Project } from './project.model';
import { User } from '../shared/user.model';

import { Config } from '../shared/config/env.config';

import 'rxjs/add/observable/throw';

declare var humps: any;

/**
 * This class provides the ProjectService with methods to manage projects.
 */
@Injectable()
export class ProjectService {
  private projectsUrl = '';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options = { headers: this.headers };

  /**
   * Creates a new ProjectService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient,
              private authService: AuthService,
              private userService: UserService) {
    this.projectsUrl = Config.API_ENDPOINT;
  }

  getAllProjectsForCurrentUser(): Observable<Project[]> {
    const id: string = this.authService.getActiveUser().id;
    return this.getAllProjectsForUser(id);
  }

  /**
   * Returns the projects for user with given id wrapped in a Observable.
   * @param {string} id - Id of user to get
   * @return {Observable<Project[]>} Observable containing json of request
   */
  getAllProjectsForUser(id: string): Observable<Project[]> {
    const body = {
      'data': {
        'user_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.projectsUrl + '/get_all_projects_of_user';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processProjectJsonList(res.projects)),
                      catchError(this.handleError)
                    );
  }

  getAllProjectsForCurrentUserGroup(): Observable<Project[]> {
    //groups have been removed
    const observables = this.authService.getActiveUser().groups.map((group: any) => {
      if (typeof group === 'string') {
        return this.getAllProjectsForGroup(group);
      } else {
        return this.getAllProjectsForGroup(group.id);
      }
    });

    return Observable
            .forkJoin(observables)
            .pipe(
              map((data: any[]) => {
                return data.reduce((prev: Project[], curr: Project[]) => {
                  return prev.concat(curr);
                });
              }),
              catchError(this.handleError)
            );
  }

  /**
   * Returns the projects for group with given id wrapped in a Observable.
   * @param {string} groupId - Id of group to get
   * @return {Observable<Project[]>} Observable containing json of request
   */
  getAllProjectsForGroup(groupId: string): Observable<Project[]> {
    const body = {
      'data': {
        'group_id': groupId
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.projectsUrl + '/get_all_projects_of_group';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processProjectJsonList(res.projects)),
                      catchError(this.handleError)
                    );
  }

  /**
   * Returns the project with given id wrapped in a Observable.
   * @param {string} id - Id for project to get
   * @return {Observable<Project>} Observable containing json of request
   */
  getProject(id: string): Observable<Project> {
    const body = {
      'data': {
        'project_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.projectsUrl + '/get_project';
    return this.http.post(requestUrl, bodyString, this.options)
                    .pipe(
                      map((res: any) => this.processProjectJson(JSON.parse(res.project))),
                      catchError(this.handleError)
                    );
  }

  getProjectCreatorName(project: Project): Observable<string> {
    const userId = project.userId;
    return this
            .userService
            .getUser(userId)
            .pipe(
              map((user: User) => {
                return this.userService.getFullNameForUser(user);
              }),
              catchError(this.handleError)
            );
  }

  /**
   * Adds project for user with id in Project object.
   * @param {Project} project - Id for chapter to get
   * @return {Promise<boolean>} Promise containing success of request
   */
  createProject(project: Project): Observable<Project> {
    const user = this.authService.getActiveUser();

    project.userId = user.id;
    project.userName = this.userService.getFullNameForUser(user);

    const body = {
      'data': this.convertProjectToJson(project)
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.projectsUrl + '/add_project';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map((res: any) => this.processProjectJson(res.project)),
        catchError(this.handleError)
      );
  }

  /**
   * Deletes project with given id.
   * @param {string} id - Id of project to delete
   * @return {Promise<boolean>} Promise containing success of request
   */
  deleteProject(id: string): Observable<boolean> {
    const body = {
      'data': {
        'project_id': id
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.projectsUrl + '/delete_project';
    return this.http.post<boolean>(requestUrl, bodyString, this.options)
      .pipe(
        map((res: any) => this.processProjectJson(res.project)),
        catchError(this.handleError)
      );
  }

  /**
   * Updates project with given id and updated Project object.
   * @param {string} id - Id of project to update
   * @param {Project} project - Updated Project object
   * @return {Promise<Project>} Promise containing updated project
   */
  updateProject(id: string, project: Project): Observable<Project> {
    const body = {
      'data': {
        'project_id': id,
        'update_dict': this.convertProjectToJson(project)
      }
    };
    const bodyString = JSON.stringify(body);
    const requestUrl = this.projectsUrl + '/update_project';
    return this.http.post(requestUrl, bodyString, this.options)
      .pipe(
        map((res: any) => this.processProjectJson(res)),
        catchError(this.handleError)
      );
  }

  saveProject(project: Project): Observable<Project> {
      // If project already exists
    if (project.id) {
      return this.updateProject(project.id, project);
    } else {
      return this.createProject(project);
    }
  }

  processProjectJsonList(list: any): any {
    return list.map((json: any) => this.processProjectJson(json));
  }

  processProjectJson(json: any): any {
    const obj: any = humps.camelizeKeys(json);
    if (obj['id']) {
     obj['id'] = obj['id']['$oid'];
     obj['dateCreated'] = new Date(obj['dateCreated']);
     obj['phaserState'] = JSON.parse(obj['phaserState']);
     return Project.parse(obj);
    }
    return null;
  }

  convertProjectToJson(project: Project): any {
    const json: any = humps.decamelizeKeys(project);
    json['date_created'] = json['date_created'].getTime();
    json['phaser_state'] = JSON.stringify(json['phaser_state']);
    return json;
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
    return Observable.throw(errMsg);
  }
}
