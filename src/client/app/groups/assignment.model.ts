import { Challenge } from '../challenges/shared/challenge.model';

export class Assignment {
  id: string;
  dateDue: Date;
  challenge: Challenge;

  static parse(obj: any): Assignment {
    const assignment = Object.setPrototypeOf(obj, Assignment.prototype);
    Object.keys(obj).forEach(function (key) {
      if (key === 'challenge') {
        assignment[key] = Challenge.parse(obj[key]);
      } else {
        assignment[key] = obj[key];
      }
    });
    return assignment;
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
