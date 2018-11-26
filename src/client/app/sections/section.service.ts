import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Section } from './section.model';
import { Config } from '../shared/config/env.config';

declare var humps: any;

@Injectable()
export class SectionService {
    private sectionUrl = '';
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) {
        this.sectionUrl = Config.API_ENDPOINT;
    }

    createSection(section: Section): Observable<string> {
        const decamelizedModule = humps.decamelizeKeys(section);
        const body = {
            'data': decamelizedModule
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.sectionUrl + '/create_section';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }

    updateSection(section: Section): Observable<boolean> {
        const decamelizedModule = humps.decamelizeKeys(section);

        const body = {
            'data': {
                'section_id': section.id,
                'update_dict': decamelizedModule
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.sectionUrl + '/update_section';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    deleteSection(section_id: string[]): Observable<boolean> {

        const body = {
            'data': {
                'section_id': section_id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.sectionUrl + '/delete_section';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    getSectionUsingSchoolId(id: string): Observable<Section[]> {
        const body = {
            'data': {
                'school_id': id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.sectionUrl + '/get_section';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                /*map((data: any) => {
                    return this.processMiniSectionJsonList(data['data']);
                }),
                catchError(this.handleError)*/
                map((res: any) => this.processMiniSectionJsonList(res['data'])),
                catchError(this.handleError)
            );
    }

    getSection(id: string): Observable<Section[]> {
        const body = {
            'data': {
                'section_id': id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.sectionUrl + '/get_section_using_id';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniSectionJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    getAllSection(offset: number, size: number): Observable<Section[]> {
        const requestUrl = this.sectionUrl + '/get_all_sections/' + offset + '/' + size;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniSectionJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    searchSection(searchText: string): Observable<Section[]> {
        const requestUrl = this.sectionUrl + '/search_section/' + searchText;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniSectionJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    addStudentToSection(section_id: string, user_id: string[]): Observable<string> {
        const body = {
            'data': {
                'section_id': section_id,
                'student_id': user_id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.sectionUrl + '/add_student_to_section';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }

    deleteStudentFromSection(section_id: string, user_id: string[]): Observable<boolean> {
        const body = {
            'data': {
                'section_id': section_id,
                'student_id': user_id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.sectionUrl + '/delete_student_from_section';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }


    getSectionFromModule(moduleId: string): Observable<Section[]> {
        const body = {
            'data': {
                'module_id': moduleId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.sectionUrl + '/get_section_from_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((data: any) => {
                    return this.processMiniSectionJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    processMiniSectionJsonList(list: any[]): Section[] {
        return list.map(this.processMiniSectionJson);
    }

    processMiniSectionJson(json: any): any {
        const obj: any = humps.camelizeKeys(json);
        obj['id'] = obj['id']['$oid'];
        return Section.parse(obj);
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
