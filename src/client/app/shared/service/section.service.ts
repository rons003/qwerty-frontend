import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Config } from '../../shared/config/env.config';
import { AbstractService } from './abstract.service';
import { Section } from '../model/section.model';

declare var humps: any;

/**
 * This class provides the User service with methods to read Users who are students.
 */
@Injectable()
export class SectionService extends AbstractService {

    constructor(private http: HttpClient) {
        super();
        this.usersUrl = Config.API_ENDPOINT;
    }

    /**
    * Retrieves Paginated Users.
    * @param {number} offset - Id of user to delete
    * @return {Observable<boolean>} Observable containing success of request
    */
    getAllSection(offset: number, size: number): Observable<Section[]> {
        const requestUrl = this.usersUrl + '/get_all_sections/' + offset + '/' + size;
        return this.http.get(requestUrl, this.options)
            .pipe(
                map((data: any) => {
                    return this.processObjectJsonList(data['data']);
                }),
                catchError(this.handleError)
            );
    }

    processObjectJsonList(list: any[]): Section[] {
        return list.map(this.processObjectJson);
    }

    processObjectJson(json: any): any {
        const obj: any = humps.camelizeKeys(json);
        obj['id'] = obj['id']['$oid'];
        return Section.parse(obj);
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
