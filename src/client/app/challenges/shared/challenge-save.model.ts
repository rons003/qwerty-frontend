import { Sprite } from './sprite.model';

export class ChallengeSave {
  id: string;
  userId: string;
  challengeId: string;
  phaserState: Sprite[];
  blocklyState: string;

  static parse(obj: any): ChallengeSave {
    const challengeSave = Object.setPrototypeOf(obj, ChallengeSave.prototype);
    Object.keys(obj).forEach(function (key) {
      if (key === 'phaserState') {
        challengeSave[key] = obj[key].map(function(object: any) {
          return Sprite.parse(object);
        });
      } else {
        challengeSave[key] = obj[key];
      }
    });
    return challengeSave;
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
