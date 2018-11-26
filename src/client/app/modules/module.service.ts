import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Module } from './module.model';
import { Config } from '../shared/config/env.config';

declare var humps: any;

@Injectable()
export class ModuleService {
    private moduleUrl = '';
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) {
        this.moduleUrl = Config.API_ENDPOINT;
    }

    createModule(module: Module): Observable<string> {
        const decamelizedModule = humps.decamelizeKeys(module);
        const body = {
            'data': decamelizedModule
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/create_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((res: any) => res),
                catchError(this.handleError)
            );
    }

    updateModule(module: Module): Observable<boolean> {
        const decamelizedModule = humps.decamelizeKeys(module);

        const body = {
            'data': {
                'module_id': module.id,
                'update_dict': decamelizedModule
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/update_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    deleteModule(module_id: string[]): Observable<boolean> {

        const body = {
            'data': {
                'module_id': module_id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/delete_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    getModulesUsingSchoolId(id: string): Observable<Module[]> {
        const body = {
            'data': {
                'school_id': id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/get_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((data: any) => {
                    return this.processModuleJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    getModules(id: string): Observable<Module> {
        const body = {
            'data': {
                'module_id': id
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/get_module_using_id';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map((data: any) => {
                    return this.processModuleJson(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    getAllModules(offset: number, size: number): Observable<Module[]> {
        const requestUrl = this.moduleUrl + '/get_all_modules/' + offset + '/' + size;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processModuleJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    addSectionToModule(moduleId: string, sectionId: string): Observable<boolean> {
        const body = {
            'data': {
                'module_id': moduleId,
                'section_id': sectionId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/add_section_to_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }


    deleteSectionFromModule(moduleId: string, sectionId: string[]): Observable<boolean> {
        const body = {
            'data': {
                'module_id': moduleId,
                'section_id': sectionId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/delete_section_from_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    addChapterToModule(moduleId: string, chapterId: string): Observable<boolean> {
        const body = {
            'data': {
                'module_id': moduleId,
                'chapter_id': chapterId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/add_chapter_to_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }

    deleteChapterFromModule(moduleId: string, chapterId: string[]): Observable<boolean> {
        const body = {
            'data': {
                'module_id': moduleId,
                'chapter_id': chapterId
            }
        };
        const bodyString = JSON.stringify(body);
        const requestUrl = this.moduleUrl + '/delete_chapter_from_module';
        return this.http.post(requestUrl, bodyString, this.options)
            .pipe(
                map(this.getSuccessResponse),
                catchError(this.handleError)
            );
    }


    // processUserJson(json: any): any {
    //     const obj: any = humps.camelizeKeys(json);
    //     obj['id'] = obj['id']['$oid'];
    //     obj['dateJoined'] = new Date(obj['dateJoined']);
    //     obj['chapterProgress'] = JSON.parse(obj['chapterProgress']);
    //     obj['chapterItemProgress'] = JSON.parse(obj['chapterItemProgress']);
    //     obj['assignmentProgress'] = JSON.parse(obj['assignmentProgress']);

    //     return Module.parse(obj);
    // }

    processModuleJsonList(list: any[]): Module[] {
        return list.map(this.processModuleJson);
    }

    processModuleJson(json: any): any {
        const obj: any = humps.camelizeKeys(json);
        obj['id'] = obj['id']['$oid'];
        return Module.parse(obj);
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
