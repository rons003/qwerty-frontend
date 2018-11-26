import { Image } from './image.model';
import { SharedConstants } from '../shared/shared-constants';

const spriteLength = 100;
const gameLength = 600;

export class PhaserConstants {

  //================================================================================
  // Error Messages
  //================================================================================
  static readonly ERROR_LOOP_NUMBER = `Please input a valid number of times to loop.`;
  static readonly ERROR_RANDOM = `Random Block's Upper Bound must be higher than Lower Bound.`;
  static readonly ERROR_WAIT = `Enter a positive number in Wait Block.`;
  static readonly ERROR_PEN_SET_SIZE = `Enter a positive number in Set Pen Size Block.`;
  static readonly ERROR_PEN_ALL = `Enter a positive number in Set Size of Set Pen Settings Block.`;

  static readonly spriteLength = spriteLength;
  static readonly gameLength = gameLength;

    /*
    No matter what phaser is resized to, the internal coordinates are always 600 x 600

             INTERNAL WIDTH = 600px
    *-------------------------------------*
    |                                     |
    |                                     |
    |                                     |
    |                                     |
    |                                     |
    |                                     | INTERNAL HEIGHT
    |                                     |
    |                                     |     600px
    |                                     |
    |                                     |
    |                                     |
    |                                     |
    |                                     |
    |                                     |
    *-------------------------------------*
    */

  static readonly defaultSpriteProperties: any = {
    /*
    *-------------------------------------*
    |         FORBIDDEN SPAWNZONE         |
    |     100                             |
    | 100  *-----------------------*      |
    |      |          3rd          |      |
    |      |        *   4th        |      |
    |      |          *   5th      |      |
    |      |            *          |      |
    |      |                       |      |
    |      |    1st                |      |
    |      |-50-*    2nd           |      |
    |      |    50 *               |      |
    | 100  *-----------------------*      |
    |                                     |
    |         FORBIDDEN SPAWNZONE         |
    *-------------------------------------*
    */
    'initialPosition': {
      'permittedZone': 100,
      'startBuffer': 50,
      'offsetBetweenSprites': spriteLength
    },
    'length': spriteLength
  };

  static readonly spriteSelectorPositions: any = {
    'x': 50,
    'y': 550,
    'offsetBetweenSprites': 100
  };

  static readonly spriteImages: Image[] = [
    {
      id: SharedConstants.SPRITE_CAT,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_CAT)
    },
    {
      id: SharedConstants.SPRITE_BUTTERFLY,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_BUTTERFLY)
    },
    {
      id: SharedConstants.SPRITE_BEE,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_BEE)
    },
    {
      id: SharedConstants.SPRITE_SNAIL,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_SNAIL)
    },
    {
      id: SharedConstants.SPRITE_RABBIT,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_RABBIT)
    },
    {
      id: SharedConstants.SPRITE_LADYBUG,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_LADYBUG)
    },
    {
      id: SharedConstants.SPRITE_MONKEY,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_MONKEY)
    },
    {
      id: SharedConstants.SPRITE_LION,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_LION)
    },
    {
      id: SharedConstants.SPRITE_OCTOPUS,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_OCTOPUS)
    },
    {
      id: SharedConstants.SPRITE_CRAB,
      source: SharedConstants.generateSourceUrl(SharedConstants.SPRITE_CRAB)
    }
  ];

  static getVariableUninitializedMessage(variableName: any): string {
    return `Initialize Variable '${variableName}' with 'Set Variable' before using it.`;
  }
}
