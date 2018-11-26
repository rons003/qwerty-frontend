import { Sprite } from '../challenges/shared/sprite.model';
import { ChallengeSave } from '../challenges/shared/challenge-save.model';

export class Project {
  id: string;
  userId: string;
  userName: string;
  name: string;
  dateCreated: Date;
  phaserState: Sprite[];
  blocklyState: string;

  static parse(obj: any): Project {
    const project = Object.setPrototypeOf(obj, Project.prototype);

    Object.keys(obj).forEach(function (key) {
      if (key === 'dateCreated') {
        project[key] = new Date(obj[key]);
      } else if (key === 'phaserState') {
        project[key] = obj[key].map(function(object: any) {
          return Sprite.parse(object);
        });
      } else {
        project[key] = obj[key];
      }
    });
    return project;
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
