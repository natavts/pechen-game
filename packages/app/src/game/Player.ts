/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import { User } from './GameRoom';

export interface Character {
  name: string;
  attack: string;
  defence: string;
}

export class Player {
  public priorityId: number;
  public conflictType: string | null = null;
  public userId = 0;
  public name = 'defaultName';
  public points = 0;
  private _character: Character;

  public attack: null | User['userId'] = null;
  public defence: null | User['userId'] = null;
  public characters: string[] = [];

  constructor(player: User, priorityId: number) {
    Object.assign(this, player);
    this.priorityId = priorityId;
  }

  public get character(): Character {
    return this._character;
  }

  public set character(character) {
    this._character = character;
  }

  public get characterName(): string {
    return this.character.name;
  }
}
