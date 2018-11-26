import { SharedConstants } from '../shared/shared-constants';

export class BlocklyConverter {
  /**
   * Generates a Blockly block template with given key and value if it exists.
   * New blocks should be added here in alphabetical order.
   */
  static generateBlockWithKey(block: any): string {
    const key: any = block['key'];
    const position: any = block['position'];
    const values: any = block['values'];
    const children: any = block['children'];
    const next: any = block['next'];

    // Set position if block definition contains position
    let positionString = ``;
    const hasPositionX = position && position['x'] !== undefined;
    const hasPositionY = position && position['y'] !== undefined;
    const x = hasPositionX ? position['x'] : 20; // DEFAULT X BLOCK POSITION
    const y = hasPositionY ? position['y'] : 20; // DEFAULT X BLOCK POSITION
    positionString = `x='${x}' y='${y}'`;

    let nextBlockString = ``;
    if (next) {
      nextBlockString = `<next>
                           ${ this.generateBlockWithKey(next)}
                         </next>`;
    }

    let childrenBlockString = ``;
    if (children) {
      childrenBlockString = `<statement name='DO'>
                               ${ this.generateBlockWithKey(children)}
                             </statement>`;
    }

    let hasValues0, hasValues1, hasValues2;
    let arg0, arg1, arg2;
    let arg0BlockString = ``;
    let arg1BlockString = ``;
    let arg2BlockString = ``;

    switch (block['key']) {
      case SharedConstants.GAKKO_EVENT_ALL:
        hasValues0 = values && values[0] !== undefined;
        hasValues1 = values && values[1] !== undefined;
        arg0 = hasValues0 ? values[0] : 'none'; // DEFAULT ARG VALUE
        arg1 = hasValues1 ? values[1] : 'EVENT_START'; // DEFAULT ARG VALUE

        if (hasValues0) {
          return `<block type='${key}' ${positionString}>
                    <field name='ARG0'>${arg0}</field>
                    <field name='ARG1'>${arg1}</field>
                    ${childrenBlockString}
                  </block>`;
        } else {
          return `<block type='${key}' ${positionString}>
                    <field name='ARG1'>${arg1}</field>
                    ${childrenBlockString}
                  </block>`;
        }

      case SharedConstants.GAKKO_EVENT_CAT:
      case SharedConstants.GAKKO_EVENT_BUTTERFLY:
      case SharedConstants.GAKKO_EVENT_BEE:
      case SharedConstants.GAKKO_EVENT_SNAIL:
      case SharedConstants.GAKKO_EVENT_RABBIT:
      case SharedConstants.GAKKO_EVENT_LADYBUG:
      case SharedConstants.GAKKO_EVENT_MONKEY:
      case SharedConstants.GAKKO_EVENT_LION:
      case SharedConstants.GAKKO_EVENT_OCTOPUS:
      case SharedConstants.GAKKO_EVENT_CRAB:
        return `<block type='${key}' ${positionString}>
                  ${childrenBlockString}
                </block>`;

      case SharedConstants.GAKKO_EVENT_KEYBOARD:
        hasValues0 = values && values[0] !== undefined;
        hasValues1 = values && values[1] !== undefined;
        arg0 = hasValues0 ? values[0] : 'none'; // DEFAULT ARG VALUE
        arg1 = hasValues1 ? values[1] : 'up'; // DEFAULT ARG VALUE

        if (hasValues0) {
          return `<block type='${key}' ${positionString}>
                    <field name='ARG0'>${arg0}</field>
                    <field name='ARG1'>${arg1}</field>
                    ${childrenBlockString}
                  </block>`;
        } else {
          return `<block type='${key}' ${positionString}>
                    <field name='ARG1'>${arg1}</field>
                    ${childrenBlockString}
                  </block>`;
        }

      case SharedConstants.GAKKO_EVENT_COLLISION:
        hasValues0 = values && values[0] !== undefined;
        hasValues1 = values && values[1] !== undefined;
        arg0 = hasValues0 ? values[0] : 'none'; // DEFAULT ARG VALUE
        arg1 = hasValues1 ? values[1] : 'none'; // DEFAULT ARG VALUE

        if (hasValues0 && hasValues1) {
          return `<block type='${key}' ${positionString}>
                  <field name='ARG0'>${arg0}</field>
                  <field name='ARG1'>${arg1}</field>
                    ${childrenBlockString}
                  </block>`;
        } else {
          return `<block type='${key}' ${positionString}>
                  ${childrenBlockString}
                </block>`;
        }
      case SharedConstants.GAKKO_EVENT_RECEIVE:
        hasValues0 = values && values[0] !== undefined;
        hasValues1 = values && values[1] !== undefined;
        arg0 = hasValues0 ? values[0] : 'none'; // DEFAULT ARG VALUE
        arg1 = hasValues1 ? values[1] : 'message'; // DEFAULT ARG VALUE

        if (hasValues0) {
          return `<block type='${key}' ${positionString}>
                    <field name='ARG0'>${arg0}</field>
                    <field name='ARG1'>${arg1}</field>
                    ${childrenBlockString}
                  </block>`;
        } else {
          return `<block type='${key}' ${positionString}>
                    <field name='ARG1'>${arg1}</field>
                    ${childrenBlockString}
                  </block>`;
        }
      case SharedConstants.GAKKO_EVENT_BROADCAST:
      case SharedConstants.GAKKO_EVENT_START:
      case SharedConstants.GAKKO_EVENT_CLICK:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 'none'; // DEFAULT ARG VALUE

        if (hasValues0) {
          return `<block type='${key}' ${positionString}>
                  <field name='ARG0'>${arg0}</field>
                    ${childrenBlockString}
                  </block>`;
        } else {
          return `<block type='${key}' ${positionString}>
                    ${childrenBlockString}
                  </block>`;
        }

      case SharedConstants.GAKKO_CONTROLS_REPEAT:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 3; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);

        return `<block type='${key}' ${positionString}>
                  <value name='TIMES'>${arg0BlockString}</value>
                  ${childrenBlockString}
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_CONTROLS_REPEAT_FOREVER:
        return `<block type='${key}' ${positionString}>
                  ${childrenBlockString}
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_SCORE_CHANGE:
      case SharedConstants.GAKKO_MOVEMENT_CHANGE_X_BY:
      case SharedConstants.GAKKO_MOVEMENT_CHANGE_Y_BY:
      case SharedConstants.GAKKO_MOVEMENT_WAIT:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 10; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);

        return `<block type='${key}' ${positionString}>
                  <value name='ARG0'>${arg0BlockString}</value>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_MOVEMENT_JUMP:
      case SharedConstants.GAKKO_DRAWING_PEN_DOWN:
      case SharedConstants.GAKKO_DRAWING_PEN_CLEAR:
        return `<block type='${key}' ${positionString}>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_MOVEMENT_JUMP_HEIGHT:
      case SharedConstants.GAKKO_MOVEMENT_FORWARD:
      case SharedConstants.GAKKO_MOVEMENT_MOVE_X:
      case SharedConstants.GAKKO_MOVEMENT_MOVE_Y:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 100; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);
        return `<block type='${key}' ${positionString}>
                  <value name='ARG0'>${arg0BlockString}</value>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_MOVEMENT_ROTATE_EASY:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 90; // DEFAULT ARG VALUE

        return `<block type='${key}' ${positionString}>
                  <field name='ARG0'>${arg0}</field>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_MOVEMENT_ROTATE:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 90; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);

        return `<block type='${key}' ${positionString}>
                  <value name='ARG0'>${arg0BlockString}</value>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_MOVEMENT_MOVE_X_Y:
      case SharedConstants.GAKKO_MOVEMENT_SET_POSITION:
        hasValues0 = values && values[0] !== undefined;
        hasValues1 = values && values[1] !== undefined;
        arg0 = hasValues0 ? values[0] : 100; // DEFAULT ARG VALUE
        arg1 = hasValues1 ? values[1] : 100; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);
        arg1BlockString = this.parseValue(arg1);

        return `<block type='${key}' ${positionString}>
                  <value name='ARG0'>${arg0BlockString}</value>
                  <value name='ARG1'>${arg1BlockString}</value>
                  ${nextBlockString}
              </block>`;

      case SharedConstants.GAKKO_MOVEMENT_SET_SPEED:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : SharedConstants.SPEED_SETTING_NORMAL; // DEFAULT ARG VALUE

        return `<block type='${key}' ${positionString}>
                  <field name='ARG0'>${arg0}</field>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_DRAWING_PEN_ALL:
        hasValues0 = values && values[0] !== undefined;
        hasValues1 = values && values[1] !== undefined;
        hasValues2 = values && values[2] !== undefined;
        arg0 = hasValues0 ? values[0] : true; // DEFAULT ARG VALUE
        arg1 = hasValues1 ? values[1] : '#ff6600'; // DEFAULT ARG VALUE
        arg2 = hasValues2 ? values[2] : 5; // DEFAULT ARG VALUE
        arg2BlockString = this.parseValue(arg2);

        return `<block type='${key}' ${positionString}>
                  <field name='ARG0'>${arg0}</field>
                  <field name='ARG1'>${arg1}</field>
                  <value name='ARG2'>${arg2BlockString}</value>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_DRAWING_PEN_DOWN_BOOLEAN:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : true; // DEFAULT ARG VALUE

        return `<block type='${key}' ${positionString}>
                  <field name='ARG0'>${arg0}</field>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_DRAWING_PEN_SET_SIZE:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 5; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);

        return `<block type='${key}' ${positionString}>
                  <value name='ARG0'>${arg0BlockString}</value>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.GAKKO_DRAWING_PEN_SET_COLOUR:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : '#ff6600'; // DEFAULT ARG VALUE

        return `<block type='${key}' ${positionString}>
                  <field name='ARG0'>${arg0}</field>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.COLOUR_PICKER:
        if (values.length !== 1) {
          return ``;
        }
        return `<block type='${key}' ${positionString}>
                  <field name='COLOUR'>${values[0]}</field>
                </block>`;

      case SharedConstants.COLOUR_RANDOM:
        return `<block type='${key}' ${positionString}></block>`;

      case SharedConstants.COLOUR_RGB:
        if (values.length !== 3) {
          return ``;
        }
        return `<block type='${key}' ${positionString}>
                  <value name='RED'>
                    <shadow type='math_number'>
                      <field name='NUM'>${values[0]}</field>
                    </shadow>
                  </value>
                  <value name='GREEN'>
                    <shadow type='math_number'>
                      <field name='NUM'>${values[1]}</field>
                    </shadow>
                  </value>
                  <value name='BLUE'>
                    <shadow type='math_number'>
                      <field name='NUM'>${values[2]}</field>
                    </shadow>
                  </value>
                </block>`;

      case SharedConstants.CONTROLS_IF:
        return `<block type='${key}' ${positionString}></block>`;

      case SharedConstants.CONTROLS_WHILE_UNTIL:
        return `<block type='${key}' ${positionString}>
                  <field name='MODE'>WHILE</field>
                </block>`;

      case SharedConstants.LOGIC_OPERATION:
        return `<block type='${key}' ${positionString}>
                  <field name='OP'>AND</field>
                </block>`;

      case SharedConstants.LOGIC_BOOLEAN:
        return `<block type='${key}' ${positionString}>
                  <field name='BOOL'>TRUE</field>
                </block>`;

      case SharedConstants.LOGIC_NEGATE:
        return `<block type='${key}' ${positionString}></block>`;

      case SharedConstants.MATH_ARITHMETIC:
        if (values.length !== 2) {
          return ``;
        }
        return `<block type='${key}' ${positionString}>
                  <field name='OP'>ADD</field>
                  <value name='A'>
                    <shadow type='math_number' >
                      <field name='NUM'>${values[0]}</field>
                    </shadow>
                  </value>
                  <value name='B'>
                    <shadow type='math_number'>
                      <field name='NUM'>${values[1]}</field>
                    </shadow>
                  </value>
                </block>`;

      case SharedConstants.MATH_NUMBER:
        return `<block type='${key}' ${positionString}>
                  <field name='NUM'>0</field>
                </block>`;

      case SharedConstants.GAKKO_RANDOM_NUMBER:
        hasValues0 = values && values[0] !== undefined;
        hasValues1 = values && values[1] !== undefined;
        arg0 = hasValues0 ? values[0] : 1; // DEFAULT ARG VALUE
        arg1 = hasValues1 ? values[1] : 10; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);
        arg1BlockString = this.parseValue(arg1);

        return `<block type='${key}' ${positionString}>
                  <value name='ARG0'>${arg0BlockString}</value>
                  <value name='ARG1'>${arg1BlockString}</value>
                </block>`;

      case SharedConstants.VARIABLES_SET:
        hasValues0 = values && values[0] !== undefined;
        hasValues1 = values && values[1] !== undefined;
        arg0 = hasValues0 ? values[0] : 'foo'; // DEFAULT ARG VALUE
        arg1 = hasValues1 ? values[1] : 100; // DEFAULT ARG VALUE
        arg1BlockString = this.parseValue(arg1);

        return `<block type='${key}'>
                  <field name='VAR'>${arg0}</field>
                  <value name='VALUE'>${arg1BlockString}</value>
                  ${nextBlockString}
                </block>`;

      case SharedConstants.VARIABLES_GET:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 'foo'; // DEFAULT ARG VALUE

        return `<block type='${key}'>
                  <field name='VAR'>${arg0}</field>
                </block>`;

      case SharedConstants.MATH_CHANGE:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 'foo'; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);

        return `<block type='${key}'>
                  <field name='VAR'>${arg0}</field>
                  <value name='DELTA'>${arg1BlockString}</value>
                  ${nextBlockString}
                </block>`;
      //SPEECH
      case SharedConstants.GAKKO_AUDIO_SET_SPEECH:
        hasValues0 = values && values[0] !== undefined;
        arg0 = hasValues0 ? values[0] : 'Say a word'; // DEFAULT ARG VALUE
        arg0BlockString = this.parseValue(arg0);
        return `<block type='${key}' ${positionString}>
                <value name='ARG0'></field>
                </block>`;
      default:
        console.log(`Unable to find block ${key}`);
        return ``;
    }
  }
  static parseValue(value: any): string {
    if (typeof (value) === 'object') {
      return this.generateBlockWithKey(value);
    } else {
      return `<shadow type='math_number'>
                <field name='NUM'>${value}</field>
              </shadow>`;
    }
  }
}
