export class Sprite {
  key: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  enabled: boolean;

  static parse(json: JSON): Sprite {
    const sprite: any = new Sprite();
    const obj: any = json;
    Object.keys(obj).forEach(function (key) {
      sprite[key] = obj[key];
    });
    return sprite;
  }

  toJson(): JSON {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }
}
