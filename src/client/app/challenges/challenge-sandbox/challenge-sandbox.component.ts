import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { PhaserComponent } from '../phaser/phaser.component';
import { BlocklyComponent } from '../blockly/blockly.component';

import { Challenge } from '../shared/challenge.model';
import { ChallengeSave } from '../shared/challenge-save.model';
import { Sprite } from '../shared/sprite.model';

declare var humps: any;

@Component({
  moduleId: module.id,
  selector: 'cg-challenge-sandbox',
  templateUrl: 'challenge-sandbox.component.html',
  styleUrls: ['../challenge.component.css'],
})
export class ChallengeSandboxComponent implements OnInit, OnChanges {
  @ViewChild('phaser') phaser: PhaserComponent;
  @ViewChild('blockly') blockly: BlocklyComponent;

  @Input() phaserState: Sprite[];
  @Input() blocklyState: string;

  private challenge: Challenge = new Challenge();

  /**
   * Creates an instance of the ChallengeSandboxComponent.
   */
  constructor(private http: HttpClient) {  }

  ngOnInit() {
    this.getChallengeFromJson();
  }

  /**
   * Checks for changes to Inputs and updates BlocklyComponent when needed.
   */
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const change = changes[propName];
      const curr  = JSON.stringify(change.currentValue);
      const prev = JSON.stringify(change.previousValue);

      // If there's no change
      if (curr === prev || !change.currentValue) {
        return;
      }

      if (propName === 'phaserState') {
        this.phaser.updateSpriteStates(change.currentValue);
      } else if (propName === 'blocklyState') {
        this.blockly.updateWorkspaceState(change.currentValue);
      }
    }
  }

  getChallengeFromJson() {
    this.http.get('assets/data-sandbox.json')
             .pipe(
               map(res => this.initialiseComponents(res))
             )
             .subscribe();
  }

  getPhaserState(): Sprite[] {
    return this.phaser.getSpriteStates();
  }

  getBlocklyState(): string {
    return this.blockly.getWorkspaceState();
  }

  isInPlayMode() {
    return this.phaser.isInPlayMode;
  }

  togglePlayMode() {
    this.phaser.togglePlayMode();
  }

  initialiseComponents(json: object) {
    this.challenge = this.processChallengeJson(json);

    this.phaser.initialiseWorkspace(this.challenge,
                                    true,
                                    this.blockly.getBlocks.bind(this.blockly),
                                    this.phaserState);
    this.blockly.initialiseWorkspace(this.challenge,
                                     true,
                                     this.phaser.getActiveSprites.bind(this.phaser),
                                     this.blocklyState);
  }

  /**
    * Converts json object into Challenge object.
    */
  processChallengeJson(json: object) {
    json = humps.camelizeKeys(json);

    const challenge = Object.assign(new Challenge(), json);
    challenge.sprites = challenge.sprites.map(function(sprite: object) {
      return Object.assign(new Sprite(), sprite);
    });
    return challenge;
  }

}
