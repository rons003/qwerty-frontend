import { Group } from '../groups/group.model';
// import { Project } from '../projects/project.model';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  pwd: string;
  email: string;
  photoIcon: string;
  dateJoined: Date;
  groups: Array<Group>;
  userType: number; // 0 - student, 1 - admin
  // projects: Array<Project>;
  assignmentProgress: Map<string, boolean>;
  chapterProgress: Map<string, boolean>;
  chapterItemProgress: Map<string, boolean>;

  static parse(obj: any): User {
    const user = Object.setPrototypeOf(obj, User.prototype);

    for (const key of Object.keys(obj)) {
      if (key === 'dateJoined') {
        user[key] = new Date(obj[key]);
      } else if (key === 'assignmentProgress' ||
                 key === 'chapterProgress' ||
                 key === 'chapterItemProgress') {

        if (this.isObjectEmpty(obj[key])) {
          user[key] = new Map<string, boolean>();
        } else {
          user[key] = new Map<string, boolean>(obj[key]);
        }
      // } else if (key === 'projects') {
      //   user[key] = obj[key].map((project: Project) => {
      //     return Project.parse(project);
      //   });
      } else {
        user[key] = obj[key];
      }
    }
    return user;
  }

  static isObjectEmpty(object: any) {
    return !object || (object.constructor === Object && Object.keys(object).length === 0);
  }

  /**
   * check if given key has a Date type value
   * NOTE: new keys added with Date value need to be added to array dateKeys
   * @param key
   * @returns {boolean}
   */
  static hasDateValue(key: string): boolean {
    const dateKeys = ['dateJoined'];

    for (const dateKey of dateKeys) {
      if (dateKey === key) {
        return true;
      }
    }

    return false;
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
