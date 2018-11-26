import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { User } from '../shared/user.model';

const firstNames = [
  'Abigail', 'Adam', 'Bob', 'Billy', 'Bertha', 'Charles', 'Catherine',
  'Desmond', 'Deva', 'Elizabeth', 'Crystal', 'George', 'Sean', 'Dylan',
  'Noor', 'Marvin', 'Zachary', 'Yvette', 'Aaron', 'Vanessa'
];
const lastNames = [
  'Tan', 'Lee', 'Santos', 'Johnson', 'Sarasvathy', 'Toh', 'Smith',
  'Mohammed', 'Ho'
];

/**
 * This class provides the Student service with methods to read Users who are students.
 */
@Injectable()
export class StudentService {
  private students: User[] = [];

  /**
   * Creates a new StudentService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {
    for (let i = 1; i < 40; i++) {
      const student = new User();
      student.id = '' + i;
      student.firstName = this.getRandomInArray(firstNames);
      student.lastName = this.getRandomInArray(lastNames);
      student.username = student.firstName + student.lastName;
      student.photoIcon = '/assets/img/student0' + Math.ceil(i % 9) + '.png';
      student.email = student.firstName.toLowerCase() + student.lastName.toLowerCase() + '@school.com';
      // student.schoolName = 'Beacon Primary School';
      student.chapterProgress = new Map<string, boolean>();
      student.chapterItemProgress = new Map<string, boolean>();
      student.assignmentProgress = new Map<string, boolean>();

      this.students.push(student);
    }
  }

  getRandomInArray(arr: string[]) {
    return arr[this.randomIntFromInterval(0, arr.length - 1)];
  }

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  getStudents(): Observable<User[]> {
    return new Observable(observable => {
      observable.next(this.students);
      observable.complete();
    });
  }

  getStudentsForUser(userId: string): Observable<User[]> {
    return new Observable(observable => {
      observable.next(this.students.slice(20));
      observable.complete();
    });
  }

  getStudentsForGroup(groupId: string): Observable<User[]> {
    return new Observable(observable => {
      observable.next(this.students);
      observable.complete();
    });
  }

  getStudent(id: string): Observable<User> {
    return new Observable(observable => {
      const student = this.students[parseInt(id, 10)];
      if (student) {
        observable.next(student);
        observable.complete();
      } else {
        observable.error();
      }
    });
  }

  updateChapterProgressForStudent(studentId: string, chapterId: string) {
    const student = this.students[parseInt(studentId, 10)];
    student.chapterProgress.set(chapterId, true);
  }

  updateChapterItemProgressForStudent(studentId: string, chapterItemId: string) {
    const student = this.students[parseInt(studentId, 10)];
    student.chapterItemProgress.set(chapterItemId, true);
  }

  updateAssignmentProgressForStudent(studentId: string, assignmentId: string) {
    const student = this.students[parseInt(studentId, 10)];
    student.assignmentProgress.set(assignmentId, true);
  }

  // createStudent(params: object): void {
  //   let student = new User();
  //   student.id = this.students.length;
  //   student.firstName = 'John';
  //   student.lastName = params['lastName'] ? params['lastName'] : 'Doe ' + student.id;
  //   this.students.push(student);
  // }

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
