/**
 * Created by jazlynang on 7/7/2017.
 *
 * Contains all constants to be used by both Blockly and Phaser services.
 */

export class SharedConstants {

  //================================================================================
  // Sprite Keys
  //================================================================================
  static readonly SPRITE_CAT: string = 'cat';
  static readonly SPRITE_BUTTERFLY: string = 'butterfly';
  static readonly SPRITE_BEE: string = 'bee';
  static readonly SPRITE_SNAIL: string = 'snail';
  static readonly SPRITE_RABBIT: string = 'rabbit';
  static readonly SPRITE_LADYBUG: string = 'ladybug';
  static readonly SPRITE_MONKEY: string = 'monkey';
  static readonly SPRITE_LION: string = 'lion';
  static readonly SPRITE_OCTOPUS: string = 'octopus';
  static readonly SPRITE_CRAB: string = 'crab';

  //================================================================================
  // Default Height and Width for Sprite Images in Sprite Event Blocks
  //================================================================================
  static readonly BLOCK_SPRITE_WIDTH = 30;
  static readonly BLOCK_SPRITE_HEIGHT = 30;

  //================================================================================
  // Blockly Block Keys
  //================================================================================
  // These are simplified START blocks for these sprites.
  // We use these for the first few challenges in the early chapters so that students will not get confused to
  // select the right sprite / event.
  static readonly GAKKO_EVENT_CAT: string = 'gakko_event_cat';
  static readonly GAKKO_EVENT_BUTTERFLY: string = 'gakko_event_butterfly';
  static readonly GAKKO_EVENT_BEE: string = 'gakko_event_bee';
  static readonly GAKKO_EVENT_SNAIL: string = 'gakko_event_snail';
  static readonly GAKKO_EVENT_RABBIT: string = 'gakko_event_rabbit';
  static readonly GAKKO_EVENT_LADYBUG: string = 'gakko_event_ladybug';
  static readonly GAKKO_EVENT_MONKEY: string = 'gakko_event_monkey';
  static readonly GAKKO_EVENT_LION: string = 'gakko_event_lion';
  static readonly GAKKO_EVENT_OCTOPUS: string = 'gakko_event_octopus';
  static readonly GAKKO_EVENT_CRAB: string = 'gakko_event_crab';

  // EVENT_ALL block allows the user to specify which sprite, and whether the event is start or click.
  // For now, the only 4 keyboard inputs are up, down, left, right and letters a to z. To add more inputs, modify phaser.service.ts.
  static readonly GAKKO_EVENT_ALL: string = 'gakko_event_all';
  static readonly GAKKO_EVENT_START: string = 'gakko_event_start';
  static readonly GAKKO_EVENT_KEYBOARD: string = 'gakko_event_keyboard';
  static readonly GAKKO_EVENT_COLLISION: string = 'gakko_event_collision';
  static readonly GAKKO_EVENT_CLICK: string = 'gakko_event_click';
  static readonly GAKKO_EVENT_RECEIVE: string = 'gakko_event_receive';
  static readonly GAKKO_EVENT_BROADCAST: string = 'gakko_event_broadcast';

  // These cause the blocks inside this event to be repeated x times.
  static readonly GAKKO_CONTROLS_REPEAT: string = 'gakko_controls_repeat';
  static readonly GAKKO_CONTROLS_REPEAT_FOREVER: string = 'gakko_controls_repeat_forever';

  static readonly GAKKO_SCORE_CHANGE: string = 'gakko_score_change';

  // These tweens actually take time to complete.
  // The next block will only be executed after this block is done executing.
  static readonly GAKKO_MOVEMENT_JUMP: string = 'gakko_movement_jump';
  static readonly GAKKO_MOVEMENT_JUMP_HEIGHT: string = 'gakko_movement_jump_height';
  static readonly GAKKO_MOVEMENT_FORWARD: string = 'gakko_movement_forward';
  static readonly GAKKO_MOVEMENT_ROTATE_EASY: string = 'gakko_movement_rotate_easy';
  static readonly GAKKO_MOVEMENT_ROTATE: string = 'gakko_movement_rotate';
  static readonly GAKKO_MOVEMENT_MOVE_X: string = 'gakko_movement_move_x';
  static readonly GAKKO_MOVEMENT_MOVE_Y: string = 'gakko_movement_move_y';
  static readonly GAKKO_MOVEMENT_MOVE_X_Y: string = 'gakko_movement_move_x_y';

  // These blocks trigger instantaneously and immediately calls the next block to be executed.
  // When using keyboard events, it's appropriate to use change_x_y instead of move_x_y.
  // The keyboard trigger should cause a teleport, not a tween for smooths movement.
  static readonly GAKKO_MOVEMENT_CHANGE_X_BY: string = 'gakko_movement_change_x_by';
  static readonly GAKKO_MOVEMENT_CHANGE_Y_BY: string = 'gakko_movement_change_y_by';
  static readonly GAKKO_MOVEMENT_SET_POSITION: string = 'gakko_movement_set_position';
  static readonly GAKKO_MOVEMENT_SET_SPEED: string = 'gakko_movement_set_speed';
  static readonly GAKKO_MOVEMENT_WAIT: string = 'gakko_movement_wait';

  // There are multiple pendown blocks so that the user can slowly learn each of the pen features.
  // Once the user learns all the pen features, the pen_all allows us to control all the pen properties.
  static readonly GAKKO_DRAWING_PEN_ALL: string = 'gakko_drawing_pen_all';
  static readonly GAKKO_DRAWING_PEN_DOWN: string = 'gakko_drawing_pen_down';
  static readonly GAKKO_DRAWING_PEN_DOWN_BOOLEAN: string = 'gakko_drawing_pen_down_boolean';
  static readonly GAKKO_DRAWING_PEN_SET_SIZE: string = 'gakko_drawing_pen_set_size';
  static readonly GAKKO_DRAWING_PEN_SET_COLOUR: string = 'gakko_drawing_pen_set_colour';
  static readonly GAKKO_DRAWING_PEN_CLEAR: string = 'gakko_drawing_pen_clear';

  static readonly COLOUR_PICKER: string = 'colour_picker';
  static readonly COLOUR_RANDOM: string = 'colour_random';
  static readonly COLOUR_RGB: string = 'colour_rgb';

  static readonly CONTROLS_IF: string = 'controls_if';
  static readonly CONTROLS_WHILE_UNTIL: string = 'controls_whileUntil';

  static readonly LOGIC_OPERATION: string = 'logic_operation';
  static readonly LOGIC_BOOLEAN: string = 'logic_boolean';
  static readonly LOGIC_NEGATE: string = 'logic_negate';

  static readonly MATH_ARITHMETIC: string = 'math_arithmetic';
  static readonly MATH_NUMBER: string = 'math_number';
  static readonly GAKKO_RANDOM_NUMBER: string = 'gakko_random_number';
  static readonly VARIABLES_SET: string = 'variables_set';
  static readonly VARIABLES_GET: string = 'variables_get';
  static readonly MATH_CHANGE: string = 'math_change';  // Changes a variable by given number

  //SPEECH
  static readonly GAKKO_AUDIO_SET_SPEECH: string = 'gakko_speech';

  //================================================================================
  // Set Speed Block's Settings
  //================================================================================
  static readonly SPEED_SETTING_SLOW: string = 'SLOW';
  static readonly SPEED_SETTING_NORMAL: string = 'NORMAL';
  static readonly SPEED_SETTING_FAST: string = 'FAST';

  /**
   * For sprite image URL.
   * @param spriteName
   * @returns {string}
   */
  static generateSourceUrl(spriteName: string): string {
    return `./assets/img/sprites/${spriteName}.png`;
  }
}
