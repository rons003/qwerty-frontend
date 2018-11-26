import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BlocklyComponent } from './blockly.component';
import { BlocklyService } from './blockly.service';

@NgModule({
  imports: [],
  declarations: [ BlocklyComponent ],
  exports: [ BlocklyComponent ],
  providers: [ BlocklyService ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class BlocklyModule { }
