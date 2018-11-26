import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { PhaserComponent } from './phaser.component';
import { PhaserService } from './phaser.service';

@NgModule({
  imports: [],
  declarations: [ PhaserComponent ],
  exports: [ PhaserComponent ],
  providers: [ PhaserService ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class PhaserModule { }
