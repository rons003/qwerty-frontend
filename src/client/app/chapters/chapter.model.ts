import { Challenge } from '../challenges/shared/challenge.model';
import { ChapterItem } from './chapter-item.model';

export class Chapter {
  id: string;
  name: string;
  difficulty: number;
  chapterIcon: string;
  desc: string;
  topic: string;
  chapterItems: ChapterItem[];
  visible: boolean;

  static parse(json: JSON): Chapter {
    const chapter: any = new Chapter();
    const obj: any = json;
    Object.keys(obj).forEach(function (key) {
      if (key === 'chapterItems') {
        chapter[key] = obj[key].map(function(object: any) {
          return ChapterItem.parse(object);
        });
      } else {
        chapter[key] = obj[key];
      }
    });
    return chapter;
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
