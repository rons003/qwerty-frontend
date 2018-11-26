export class SpriteBlocks {
  startBlocks: object[];
  clickBlocks: object[];
  collideBlocks: object;
  receiveBlocks: object;
  upBlocks: object[];
  downBlocks: object[];
  leftBlocks: object[];
  rightBlocks: object[];
  aBlocks: object[];
  bBlocks: object[];
  cBlocks: object[];
  dBlocks: object[];
  eBlocks: object[];
  fBlocks: object[];
  gBlocks: object[];
  hBlocks: object[];
  iBlocks: object[];
  jBlocks: object[];
  kBlocks: object[];
  lBlocks: object[];
  mBlocks: object[];
  nBlocks: object[];
  oBlocks: object[];
  pBlocks: object[];
  qBlocks: object[];
  rBlocks: object[];
  sBlocks: object[];
  tBlocks: object[];
  uBlocks: object[];
  vBlocks: object[];
  wBlocks: object[];
  xBlocks: object[];
  yBlocks: object[];
  zBlocks: object[];

  static parse(obj: any): SpriteBlocks {
    const spriteBlocks = Object.setPrototypeOf(obj, SpriteBlocks.prototype);
    Object.keys(obj).forEach(function (key) {
      spriteBlocks[key] = obj[key];
    });
    return spriteBlocks;
  }

  constructor() {
    this.startBlocks = [];
    this.clickBlocks = [];
    this.collideBlocks = {};
    this.receiveBlocks = [];
    this.upBlocks = [];
    this.downBlocks = [];
    this.leftBlocks = [];
    this.rightBlocks = [];
    this.aBlocks = [];
    this.bBlocks = [];
    this.cBlocks = [];
    this.dBlocks = [];
    this.eBlocks = [];
    this.fBlocks = [];
    this.gBlocks = [];
    this.hBlocks = [];
    this.iBlocks = [];
    this.jBlocks = [];
    this.kBlocks = [];
    this.lBlocks = [];
    this.mBlocks = [];
    this.nBlocks = [];
    this.oBlocks = [];
    this.pBlocks = [];
    this.qBlocks = [];
    this.rBlocks = [];
    this.sBlocks = [];
    this.tBlocks = [];
    this.uBlocks = [];
    this.vBlocks = [];
    this.wBlocks = [];
    this.xBlocks = [];
    this.yBlocks = [];
    this.zBlocks = [];
  }
}
