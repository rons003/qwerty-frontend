import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/observable/forkJoin';

import { School } from './school.model';
import { Config } from '../shared/config/env.config';

declare var humps: any;

@Injectable()
export class SchoolService {
    private schoolsUrl = '';
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) {
        this.schoolsUrl = Config.API_ENDPOINT;
    }

    createSchool(school: School): Observable<string> {
        const decamelizedModule = humps.decamelizeKeys(school);
        const body = {
            'data': decamelizedModule
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.schoolsUrl + '/upsert_school';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }


    updateSchool(school: School): Observable<boolean> {
        const decamelizedSchool = humps.decamelizeKeys(school);

        const body = {
            'data': {
                'school_id': school.id,
                'update_dict': decamelizedSchool
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.schoolsUrl + '/update_school';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    deleteSchool(school_id: string): Observable<boolean> {
      /*  const body = {
            'data': { 'school_id': school.id }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.schoolsUrl + '/delete_school';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );*/
            const body = {
                'data': {
                    'school_id': school_id
                }
            };
            const bodyString = JSON.stringify(body);
            const requestUrl = this.schoolsUrl + '/delete_school';
            return this.http.post(requestUrl, bodyString, this.options)
                .pipe(
                    map(this.getSuccessResponse),
                    catchError(this.handleError)
                );
    }

    getSchool(id: string): Observable<string> {
        const body = {
            'data': {
                'administrator_id': id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.schoolsUrl + '/get_school';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }

    getSchoolUsingId(id: string): Observable<any> {
        const body = {
            'data': {
                'school_id': id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.schoolsUrl + '/get_school_using_id';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }

    addStudentToSchool(school_id: string, user_id: string[]): Observable<string> {
        const body = {
            'data': {
                'school_id': school_id,
                'student_id': user_id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.schoolsUrl + '/add_student_to_school';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }

    deleteStudentFromSchool(school_id: string, user_id: string): Observable<boolean> {
        const body = {
            'data': {
                'school_id': school_id,
                'student_id': user_id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.schoolsUrl + '/delete_student_from_school';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }



    /**

  getSchool(id: string): Observable<string> {
      const body = {
          'data': {
              'administrator_id': id
          }
      };
      const bodyString = JSON.stringify(body);
      const requestUrl = this.schoolsUrl + '/get_school';
      return this.http.post(requestUrl, bodyString, this.options)
          .pipe(
              map((res: any) => res),
              catchError(this.handleError)
          );
  }

  getSchoolsUsingAdminId(id: string): Observable<School[]> {
      const body = {
          'data': {
              'administrator_id': id
          }
      };
      const bodyString = JSON.stringify(body);
      const requestUrl = this.schoolsUrl + '/get_school';
      return this.http.post(requestUrl, bodyString, this.options)
          .pipe(
              map((data: any) => {
                  return this.processMiniUserJsonList(data['data']);
              }),
              catchError(this.handleError)
          );
  }

  /**
   * Retrieves Paginated Users.
   * @param {number} offset - Id of user to delete
   * @return {Observable<boolean>} Observable containing success of request
   */
    getAllSchools(offset: number, size: number): Observable<School[]> {
        const requestUrl = this.schoolsUrl + '/get_all_schools/' + offset + '/' + size;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniUserJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    searchSchool(searchText: string): Observable<School[]> {
        const requestUrl = this.schoolsUrl + '/search_school/' + searchText;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniUserJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    processMiniUserJsonList(list: any[]): School[] {
        return list.map(this.processMiniUserJson);
    }

    processMiniUserJson(json: any): any {
        const obj: any = humps.camelizeKeys(json);
        obj['id'] = obj['id']['$oid'];
        return School.parse(obj);
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
