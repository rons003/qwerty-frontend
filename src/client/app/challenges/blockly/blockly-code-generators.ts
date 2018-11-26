import { SharedConstants } from '../shared/shared-constants';

/**
 * This class contains the code generators for custom Blockly blocks
 */
export class BlocklyCodeGenerators {

  /**
   * When called, will execute the code to load the code generators for custom Blockly blocks.
   * To be used in BlocklyService when initializing workspace.
   *
   * @param Blockly - the Blockly Javascript library
   */
  static setupGenerators(Blockly: any) {

    let sprite1 = '';
    let sprite2 = '';  // Optional parameter: requires '.' in front of any string used
    let event = '';
    let broadcastMessage = '';
    const isSpriteCollisionInit: any = {};  // For keeping track of whether sprite's collisionBlocks has
    // been initialized, prevents overwrite issues

    const loopEvents: any = {}; // For keeping track of nested children within each loop block

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_ALL] = function (block: any) {
      const spriteName = block.getFieldValue('ARG0');
      sprite1 = generateSprite1Code(spriteName);

      let code = '';
      event = block.getFieldValue('ARG1');
      if (event === 'EVENT_CLICK') {
        event = 'click';
      } else if (event === 'EVENT_START') {
        event = 'start';
      } else {
        event = '';
      }

      const branch = Blockly.JavaScript.statementToCode(block, 'DO');
      if (branch) {
        code += branch;
      }

      return code;
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_START] = function (block: any) {
      const spriteName = block.getFieldValue('ARG0');
      sprite1 = generateSprite1Code(spriteName);

      let code = '';
      event = 'start';

      const branch = Blockly.JavaScript.statementToCode(block, 'DO');
      if (branch) {
        code += branch;
      }

      return code;
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_CAT] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_CAT);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_BUTTERFLY] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_BUTTERFLY);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_BEE] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_BEE);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_SNAIL] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_SNAIL);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_RABBIT] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_RABBIT);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_LADYBUG] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_LADYBUG);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_MONKEY] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_MONKEY);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_LION] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_LION);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_OCTOPUS] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_OCTOPUS);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_CRAB] = function (block: any) {
      return generateEventBlockCode(block, SharedConstants.SPRITE_CRAB);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_KEYBOARD] = function (block: any) {
      const spriteName = block.getFieldValue('ARG0');
      sprite1 = generateSprite1Code(spriteName);
      event = block.getFieldValue('ARG1');

      let code = '';

      const branch = Blockly.JavaScript.statementToCode(block, 'DO');
      if (branch) {
        code += branch;
      }

      return code;
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_COLLISION] = function (block: any) {
      const spriteName1 = block.getFieldValue('ARG0');
      const spriteName2 = block.getFieldValue('ARG1');
      sprite1 = generateSprite1Code(spriteName1);

      event = 'collide';
      sprite2 = '.' + spriteName2;

      let code = '';

      // Prevents re-initialization if collisionBlocks for the first sprite has been initialized before
      if (isSpriteCollisionInit[spriteName1] === undefined) {
        code = `${sprite1}.${event}Blocks = {}; \n`;
        isSpriteCollisionInit[spriteName1] = true;
      }

      code += `${sprite1}.${event}Blocks${sprite2} = []; \n`;

      const branch = Blockly.JavaScript.statementToCode(block, 'DO');
      if (branch) {
        code += branch;
      }

      sprite2 = '';  // Need to reset to prevent use by other unrelated blocks

      return code;
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_RECEIVE] = function (block: any) {
      let code = '';
      const spriteName = block.getFieldValue('ARG0');
      sprite1 = generateSprite1Code(spriteName);
      event = 'receive';
      const receivemes = block.getFieldValue('ARG1');
      if (broadcastMessage === receivemes) {
        const branch = Blockly.JavaScript.statementToCode(block, 'DO');
        if (branch) {
          code += branch;
        }
      }
      return code;
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_CLICK] = function (block: any) {
      const spriteName = block.getFieldValue('ARG0');
      sprite1 = generateSprite1Code(spriteName);

      let code = '';
      event = 'click';

      const branch = Blockly.JavaScript.statementToCode(block, 'DO');
      if (branch) {
        code += branch;
      }

      return code;
    };

    Blockly.JavaScript[SharedConstants.GAKKO_CONTROLS_REPEAT] = function (block: any) {
      let numTimes = Blockly.JavaScript.valueToCode(block, 'TIMES', Blockly.JavaScript.ORDER_ATOMIC);
      numTimes = JSON.parse(numTimes);

      return generateLoopCode(block, numTimes);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_CONTROLS_REPEAT_FOREVER] = function (block: any) {
      const numTimes = 1000;
      return generateLoopCode(block, numTimes);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_SCORE_CHANGE] = function (block: any) {
      const update = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_SCORE_CHANGE, [update]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_JUMP] = function (block: any) {
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_JUMP);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_JUMP_HEIGHT] = function (block: any) {
      const height = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_JUMP_HEIGHT, [height]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_FORWARD] = function (block: any) {
      const distance = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_FORWARD, [distance]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_ROTATE_EASY] = function (block: any) {
      const degrees = block.getFieldValue('ARG0');
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_ROTATE_EASY, [degrees]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_ROTATE] = function (block: any) {
      const degrees = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_ROTATE, [degrees]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_MOVE_X] = function (block: any) {
      const distanceX = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_MOVE_X, [distanceX]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_MOVE_Y] = function (block: any) {
      const distanceY = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_MOVE_Y, [distanceY]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_MOVE_X_Y] = function (block: any) {
      const distanceX = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      const distanceY = Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_MOVE_X_Y, [distanceX, distanceY]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_CHANGE_X_BY] = function (block: any) {
      const distanceX = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_CHANGE_X_BY, [distanceX]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_CHANGE_Y_BY] = function (block: any) {
      const distanceY = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_CHANGE_Y_BY, [distanceY]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_SET_POSITION] = function (block: any) {
      const posX = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      const posY = Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_SET_POSITION, [posX, posY]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_SET_SPEED] = function (block: any) {
      const ARG0 = block.getFieldValue('ARG0');
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_SET_SPEED, [ARG0]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_MOVEMENT_WAIT] = function (block: any) {
      const waitSecs = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_MOVEMENT_WAIT, [waitSecs]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_DRAWING_PEN_ALL] = function (block: any) {
      const arg0 = block.getFieldValue('ARG0') === 'TRUE';
      const arg1 = block.getFieldValue('ARG1');
      const arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_DRAWING_PEN_ALL, [arg0, arg1, arg2]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_DRAWING_PEN_DOWN] = function (block: any) {
      return generateCode(block, SharedConstants.GAKKO_DRAWING_PEN_DOWN);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_DRAWING_PEN_DOWN_BOOLEAN] = function (block: any) {
      const arg0 = block.getFieldValue('ARG0') === 'TRUE';
      return generateCode(block, SharedConstants.GAKKO_DRAWING_PEN_DOWN_BOOLEAN, [arg0]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_DRAWING_PEN_SET_SIZE] = function (block: any) {
      const arg0 = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_DRAWING_PEN_SET_SIZE, [arg0]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_DRAWING_PEN_SET_COLOUR] = function (block: any) {
      const arg0 = block.getFieldValue('ARG0');
      return generateCode(block, SharedConstants.GAKKO_DRAWING_PEN_SET_COLOUR, [arg0]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_DRAWING_PEN_CLEAR] = function (block: any) {
      return generateCode(block, SharedConstants.GAKKO_DRAWING_PEN_CLEAR);
    };

    Blockly.JavaScript[SharedConstants.VARIABLES_SET] = function (block: any) {
      const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
      return generateCode(block, SharedConstants.VARIABLES_SET, [varName, value]);
    };

    Blockly.JavaScript[SharedConstants.VARIABLES_GET] = function (block: any) {
      const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      const returnObj = { key: SharedConstants.VARIABLES_GET, values: [varName] };
      return [JSON.stringify(returnObj)]; // If object returned, valueToCode() literally returns it as [object Object]
      // Return as JSON string, to be parsed from result of valueToCode()
    };

    Blockly.JavaScript[SharedConstants.GAKKO_RANDOM_NUMBER] = function (block: any) {
      const lowerBound = Blockly.JavaScript.valueToCode(block, 'ARG0',
        Blockly.JavaScript.ORDER_COMMA) || '0';
      const upperBound = Blockly.JavaScript.valueToCode(block, 'ARG1',
        Blockly.JavaScript.ORDER_COMMA) || '0';
      const returnObj = {
        key: SharedConstants.GAKKO_RANDOM_NUMBER, values: [parseInt(lowerBound, 10),
        parseInt(upperBound, 10)]
      };
      return [JSON.stringify(returnObj)];
    };

    Blockly.JavaScript[SharedConstants.MATH_CHANGE] = function (block: any) {
      const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      const value = Blockly.JavaScript.valueToCode(block, 'DELTA', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
      return generateCode(block, SharedConstants.MATH_CHANGE, [varName, value]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_AUDIO_SET_SPEECH] = function (block: any) {
      const text_name = block.getFieldValue('NAME');
      const value_arg0 = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_ATOMIC);
      return generateCode(block, SharedConstants.GAKKO_AUDIO_SET_SPEECH, [value_arg0, text_name]);
    };

    Blockly.JavaScript[SharedConstants.GAKKO_EVENT_BROADCAST] = function (block: any) {
      const value_arg0 = block.getFieldValue('ARG1');
      broadcastMessage = value_arg0;
      return generateCode(block, SharedConstants.GAKKO_EVENT_BROADCAST, [value_arg0]);
    };

    //================================================================================
    // Code Generator Functions
    //================================================================================

    /**
     * For generating code to be executed, given an event block and reference name for sprite.
     * Returns code that generates an object of the sprite's event block and its actions.
     *
     * @param block
     * @param spriteName
     * @returns {string}
     */
    function generateEventBlockCode(block: any, spriteName: string): string {
      sprite1 = generateSprite1Code(spriteName);

      let code = '';
      event = 'start';

      const branch = Blockly.JavaScript.statementToCode(block, 'DO');
      if (branch) {
        code += branch;
      }

      return code;
    }

    /**
     * Object Format: { key: keyName, values: values }
     *
     * Function checks if block is nested in a loop block and returns appropriate code accordingly.
     * If nested in loop: returns empty string and pushes current block as child of the parent loop
     * Else: returns the code needed to push current block as an object to the sprite
     *
     * Parameter values is optional, if none is passed as parameter, object pushed will have no values.
     * Parameter values should be an array.
     *
     * @param block
     * @param keyName
     * @param values
     * @returns {string}
     */
    function generateCode(block: any, keyName: string, values?: any[]): string {
      const parentBlock = block.getSurroundParent();

      if (values) {
        // Convert all numerical values from type string to type number
        // Convert all JSON values from type string to type JSON
        values = values.map(function (value) {
          if (isNumberString(value) || isJsonString(value)) {
            return JSON.parse(value);
          } else {
            // Booleans or Hexstrings
            return value;
          }
        });
      }

      if (isParentBlockLoop(block)) {
        if (values) {
          loopEvents[parentBlock.id].push({ key: keyName, values: values });
        } else {
          loopEvents[parentBlock.id].push({ key: keyName });
        }
        return ``;
      } else if (values) {
        return `${sprite1}.${event}Blocks${sprite2}.push({ key: '${keyName}', values: ${JSON.stringify(values)} }); \n`;
      } else {
        return `${sprite1}.${event}Blocks${sprite2}.push({ key: '${keyName}' }); \n`;
      }
    }

    /**
     * Given a loop-type block and number of repeats needed, generates code.
     * @param block
     * @param numLoops
     * @returns {string}
     */
    function generateLoopCode(block: any, numLoops: number): string {
      loopEvents[block.id] = []; // Init array in global loopEvents

      Blockly.JavaScript.statementToCode(block, 'DO');  // Run code generator for children blocks

      const loopString = JSON.stringify(loopEvents[block.id]);

      //  Once children blocks are processed and pushed into loopEvents[block.id],
      //  the object for this particular block is either pushed into parent loop block or
      //  returned as a string of code to push to sprite

      const parentBlock = block.getSurroundParent();

      //  If parentBlock is a loop block, push current block to global loopEvents using the id of parentBlock
      if (isParentBlockLoop(block)) {
        const objToPush = {
          key: SharedConstants.GAKKO_CONTROLS_REPEAT, values: [numLoops],
          children: loopEvents[block.id]
        };
        loopEvents[parentBlock.id].push(objToPush);
        return ``;
      }

      // tslint:disable-next-line:max-line-length
      return `${sprite1}.${event}Blocks${sprite2}.push({ key: '${SharedConstants.GAKKO_CONTROLS_REPEAT}', values: [${JSON.stringify(numLoops)}], children: ${loopString}}); \n`;
    }

    //================================================================================
    // Helper Functions
    //================================================================================

    /**
     * Checks if given block is nested in a loop block.
     *
     * Note: if new types of loop blocks are added, need to add them to array typesOfLoops
     *
     * @param block
     * @returns {boolean}
     */
    function isParentBlockLoop(block: any) {
      const parentBlock = block.getSurroundParent();
      const typesOfLoops = [SharedConstants.GAKKO_CONTROLS_REPEAT, SharedConstants.GAKKO_CONTROLS_REPEAT_FOREVER];
      let flag = false;

      if (parentBlock) {
        typesOfLoops.forEach(function (loopType) {
          if (parentBlock.type === loopType) {
            flag = true;
          }
        });
      }

      return flag;
    }

    /**
     * Checks if string is a NumberString like '1', '0.5', '-2'.
     * Returns true if it is. False if not
     * @param str
     * @returns {boolean}
     */
    function isNumberString(str: any) {
      return typeof (str) === 'string' && Blockly.isNumber(str);
    }

    /**
     * Checks if string is a JSONString like '{ block: X, value: [Y, Z]}'
     * Returns true if it is, False if not.
     * @param str
     * @returns {boolean}
     */
    function isJsonString(str: any) {
      try {
        // Unfortunately, JSON.parse() can successfully parse number/boolean types
        const value = JSON.parse(str);
        // Even if it parsed, if it is a number or boolean, it's still wrong.
        return (typeof value !== 'number') && (typeof value !== 'boolean');
      } catch (e) {
        // For non-JSON strings
        return false;
      }
    }

    /**
     * Returns string for getting a sprite object from this.sprites.
     * @param sprite
     * @returns {string}
     */
    function generateSprite1Code(sprite: string) {
      return `this.sprites.get('${sprite}')`;
    }

  }
}
