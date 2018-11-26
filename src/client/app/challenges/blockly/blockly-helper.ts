import { SharedConstants } from '../shared/shared-constants';

import { BlocklyDefinitions } from './blockly-definitions';
import { BlocklyCodeGenerators } from './blockly-code-generators';

declare var goog: any;

/**
 * A helper class to setup custom Blockly blocks.
 */
export class BlocklyHelper {

  /**
   * Setup custom Blockly blocks and code generators.
   *
   * @param Blockly - the Blockly Javascript library
   */
  static setupCustomBlocks(Blockly: any) {
    BlocklyDefinitions.setupDefinitions(Blockly);
    BlocklyCodeGenerators.setupGenerators(Blockly);
    this.setupUtilities(Blockly);
  }

  /**
   * Setup utilities for Blockly blocks.
   *
   * @param Blockly - the Blockly Javascript library
   */
  private static setupUtilities(Blockly: any) {
    // Orphan blocks do not compile
    Blockly.JavaScript.workspaceToCode = function (inWorkspace: any) {
      // workspaceToCode function modified from original function in blockly_compressed.js
      //inWorkspace||(console.warn("No workspace specified in workspaceToCode call.  Guessing."),inWorkspace=Blockly.getMainWorkspace());
      inWorkspace = Blockly.getMainWorkspace();

      let code: any = [];

      // Ensures ONLY blocks in Event blocks (blue blocks) are compiled into executable code
      // Orphan blocks are commented out
      // Additional Event blocks need to be added here
      const eventHeaderBlks = [
        SharedConstants.GAKKO_EVENT_ALL,
        SharedConstants.GAKKO_EVENT_START,
        SharedConstants.GAKKO_EVENT_KEYBOARD,
        SharedConstants.GAKKO_EVENT_COLLISION,
        SharedConstants.GAKKO_EVENT_RECEIVE,
        SharedConstants.GAKKO_EVENT_CLICK,
        SharedConstants.GAKKO_EVENT_CAT,
        SharedConstants.GAKKO_EVENT_BUTTERFLY,
        SharedConstants.GAKKO_EVENT_BEE,
        SharedConstants.GAKKO_EVENT_SNAIL,
        SharedConstants.GAKKO_EVENT_RABBIT,
        SharedConstants.GAKKO_EVENT_LADYBUG,
        SharedConstants.GAKKO_EVENT_MONKEY,
        SharedConstants.GAKKO_EVENT_LION,
        SharedConstants.GAKKO_EVENT_OCTOPUS,
        SharedConstants.GAKKO_EVENT_CRAB
      ];

      this.init(inWorkspace);
      const topBlocks = inWorkspace.getTopBlocks(true);

      for (let i = 0, topBlock; topBlock = topBlocks[i]; i++) {
        let line = this.blockToCode(topBlock);

        if (goog.isArray(line)) {
          // Value blocks return tuples of code and operator order.
          // Top-level blocks don't care about operator order.
          line = line[0];
        }

        if (line) {
          if (topBlock.outputConnection && this.scrubNakedValue) {
            // This block is a naked value.  Ask the language's code generator if
            // it wants to append a semicolon, or something.
            line = this.scrubNakedValue(line);
          }
          // @note: The main difference is we separate out declarations
          if (eventHeaderBlks.indexOf(topBlock.type) !== -1 ) { // isEventHeaderBlk
            code.push(line);
          } else {
            code.push('/*\n' + line + '*/');
          }
        }
      }
      code = code.join('\n');
      code = this.finish(code);
      code = scrubWhitespace(code);

      return code;
    };

    function scrubWhitespace(code: any) {
      code = code.replace(/^\s+\n/, '');
      code = code.replace(/\n\s+$/, '\n');
      code = code.replace(/[ \t]+\n/g, '\n');
      return code;
    }
  }
}
