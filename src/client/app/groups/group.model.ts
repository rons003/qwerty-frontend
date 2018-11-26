import { User } from '../shared/user.model';
import { Chapter } from '../chapters/chapter.model';
import { Challenge } from '../challenges/shared/challenge.model';
// import { Assignment } from './assignment.model';

const defaultGroupIconUrl = 'http://icons.iconarchive.com/icons/sonya/swarm/256/Cat-icon.png';

export class Group {
  id: string;
  name: string;
  students: Array<User>;
  admins: Array<User>;
  currentChapter: string;
  dateCreated: Date;
  groupIcon: string;
  chapters: Array<Chapter>;
  visibleChapters: Map<string, boolean>;
  // assignments: Array<Assignment>; // DictField
  challengeProgress: Map<string, boolean>;
  chapterProgress: Map<string, boolean>;

  static parse(obj: any): Group {
    const group = Object.setPrototypeOf(obj, Group.prototype);

    for (const key of Object.keys(obj)) {
      // if (key === 'assignments') {
      //   group[key] = obj[key].map(function(object: any) {
      //     return Assignment.parse(object);
      //   });
      // } else
      if (key === 'chapters') {
        group[key] = obj[key].map(function(object: any) {
          return Chapter.parse(object);
        });
      } else
      if (key === 'dateCreated') {
        group[key] = new Date(obj[key]);

      } else if (key === 'challengeProgress' ||
                 key === 'chapterProgress') {
        if (this.isObjectEmpty(obj[key])) {
          group[key] = new Map<string, boolean>();
        } else {
          group[key] = new Map<string, boolean>(obj[key]);
        }
      } else if (key === 'visibleChapters') {
        // Set all chapters to visible at start
        if (this.isObjectEmpty(obj[key])) {
          const chapters = new Map<string, boolean>();
          obj['chapters'].map((chapter: any) => {
            chapters.set(chapter['$oid'], true);
          });
          group[key] = chapters;
        } else {
          group[key] = new Map<string, boolean>(obj[key]);
        }
      }

      if (!obj.hasOwnProperty('visibleChapters')) {
        group['visibleChapters'] = new Map<string, boolean>(obj[key]);
      }
    }



    return group;
  }

  static isObjectEmpty(object: any) {
    return !object || (object.constructor === Object && Object.keys(object).length === 0);
  }

  constructor(name?: string, groupUrl?: string, groupIcon?: string) {
    this.name = name ? name : 'Group';

    // Optional properties
    // this.groupIcon = groupIcon ? groupIcon : defaultGroupIconUrl;

    // Initialise with defaults
    this.students = [];
    this.admins = [];
    this.currentChapter = '';
    this.dateCreated = new Date();
    this.chapters = [];
    // this.assignments = [];
    this.challengeProgress = new Map<string, boolean>();
    this.chapterProgress = new Map<string, boolean>();
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
