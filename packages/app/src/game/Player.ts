/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import { User } from './GameRoom';

export interface Character {
  name: string;
  attack: string;
  defence: string;
}

export class Player {
  public userId = 'defaultId';
  public name = 'defaultName';
  public points = 0;
  private _character: Character;

  constructor(player: User) {
    Object.assign(this, player);
  }

  public get character(): Character {
    return this._character;
  }

  public set character(character) {
    this._character = character;
  }
}
