import { Sprite } from './sprite.model';
import { SpriteBlocks } from './sprite-blocks.model';

export class Challenge {
  id: string;
  name: string;
  difficulty: number;
  desc: string;
  topic: string;
  hint: string;
  instructions: string;
  gifUrl: string;
  nextChallengeId: string;
  solutions: string[];

  sprites: Sprite[]; // Phaser
  correctPatterns: Map<string, SpriteBlocks[]>; // Phaser

  toolbox: any; // Blockly
  initialBlocks: object[]; // Blockly

  static parse(obj: any): Challenge {
    const challenge = Object.setPrototypeOf(obj, Challenge.prototype);

    for (const key of Object.keys(obj)) {
      if (key === 'sprites') {
        challenge[key] = obj[key].map((sprite: any) => {
          return Sprite.parse(sprite);
        });
      } else if (key === 'correctPatterns') {
        if (this.isObjectEmpty(obj[key])) {
          challenge[key] = new Map<string, SpriteBlocks[]>();
        } else {
          challenge[key] = this.parseCorrectPatternsMap(obj[key]);
        }
      } else {
        challenge[key] = obj[key];
      }
    }
    return challenge;
  }

  static isObjectEmpty(object: any) {
    return !object || (object.constructor === Object && Object.keys(object).length === 0);
  }

  static parseCorrectPatternsMap(map: any): Map<string, SpriteBlocks[]> {
    const correctPatterns = new Map<string, SpriteBlocks[]>();

    for (const mapKey of Object.keys(map)) {
      let array = map[mapKey];
      array = array.map((blocks: any) => SpriteBlocks.parse(blocks));

      correctPatterns.set(mapKey, array);
    }
    return correctPatterns;
  }

  constructor() {
    this.id = 'stub';
    this.name = 'Challenge Stub';
    this.desc = 'Challenge Stub Description';
    this.instructions = 'Challenge Stub Instructions';
    this.sprites = [];
    this.toolbox = {};
    this.initialBlocks = [];
    this.correctPatterns = new Map<string, SpriteBlocks[]>();
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
