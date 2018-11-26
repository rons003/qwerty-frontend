import { User } from '../shared/user.model';

export class School {
  id: string;
  name: string;
  address: string;
  teachers: Array<User>;
  administratorId: string;
  studentList: Array<User>;

  static parse(obj: any): School {
    const school = Object.setPrototypeOf(obj, School.prototype);

    for (const key of Object.keys(obj)) {
      /*if (key === 'teacherList' ||
          key === 'sectionList' ||
          key === 'chapterList') {
          if (this.isObjectEmpty(obj[key])) {
              school[key] = new Map<string, boolean>();
          } else {
              school[key] = new Map<string, boolean>(obj[key]);
          }
      } else {*/
      school[key] = obj[key];
      //}
    }

    return school;
  }

  static isObjectEmpty(object: any) {
    return !object || (object.constructor === Object && Object.keys(object).length === 0);
  }

  constructor(name?: string, schoolUrl?: string) {
    this.name = name ? name : 'School';
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
