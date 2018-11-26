import { Challenge } from '../challenges/shared/challenge.model';

export class ChapterItem {
  id: string;
  type: string; // Types: video, slides, challenge
  name: string;
  url: string;
  challengeId: string;

  static parse(json: any): ChapterItem {
    const displayItem: any = new ChapterItem();
    const obj: any = json;
    Object.keys(obj).forEach(function (key) {
      displayItem[key] = obj[key];
    });
    return displayItem;
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
