/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */

import find from 'lodash/find';
import join from 'lodash/join';
import { Player } from './Player';
import { User } from './GameRoom';
import {
  persons,
  // mockPlayers
} from '../mocks/mocks';

enum TurnType {
  attack = 'attack',
  defence = 'defence',
  character = 'character',
}

interface Turn {
  type: TurnType;
  data: ActionData | CharacterData;
}

interface ActionData {
  userId: number;
  opponentId: number;
}

interface CharacterData {
  userId: number;
  characterName: string;
}

export class Game {
  public round = 0;

  private players: Player[] = [];
  private events: Turn[] = [];
  public turns: Turn[] = [];

  constructor({ players }: { players: User[] }) {
    this.players = players.map(p => new Player(p));
    this.start();
  }

  public start(): void {
    this.initCharacters();
    this.events = [];
    this.turns = [];
  }

  private initCharacters(): void {
    this.players = this.players.map((player, i) => {
      player.character = persons[i];
      return player;
    });
  }

  public getPlayer(userId: User['userId']): Player | undefined {
    return find(this.players, { userId });
  }

  public getCharactersList(userId: User['userId']): string {
    const characterNames = persons.map(person => person.name);
    return join(
      characterNames.filter(person => this.getPlayer(userId)?.characterName !== person),
      '\n',
    );
  }

  public checkTurnEnd(): void {
    if (this.isTurnEnd()) {
      console.log('isTurnEnd');
      this.events.push(...this.turns);
      this.turns = [];
      if (this.isRoundEnd()) {
        // checkConflict
        this.setPoints();
        console.log({ players: this.players });
      }
    }
  }

  private setPoints(): void {
    this.players.forEach(player => {
      const { userId, character } = player;

      const attack = find(this.events, { data: { userId }, type: TurnType.attack }) as Turn;
      const defence = find(this.events, { data: { userId }, type: TurnType.defence }) as Turn;

      const victimPlayer = this.getPlayer((attack.data as ActionData).opponentId)?.characterName;
      const attackingPlayer = this.getPlayer((defence.data as ActionData).opponentId)?.characterName;

      if (victimPlayer === character.attack) {
        player.points += 2;
      }

      if (attackingPlayer === character.defence) {
        player.points += 1;
      }
    });
  }

  public makeTurn(turn: Turn): void {
    this.turns.push(turn);
    this.checkTurnEnd();
  }

  public attack(data: ActionData): void {
    this.makeTurn({
      type: TurnType.attack,
      data,
    });
  }

  public defence(data: ActionData): void {
    this.makeTurn({
      type: TurnType.defence,
      data,
    });
  }

  public character(data: CharacterData): void {
    this.makeTurn({
      type: TurnType.defence,
      data,
    });
  }

  private isTurnEnd(): boolean {
    return this.turns.length === this.players.length;
  }

  private isRoundEnd(): boolean {
    const attacks = this.events.filter(e => e.type === 'attack');
    const defence = this.events.filter(e => e.type === 'defence');

    return attacks.length === this.players.length && defence.length === this.players.length;
  }
}

// const game = new Game({ players: mockPlayers });

// console.log(game.getPlayer(0)?.characterName);
// game.attack({ userId: 0, opponentId: 1 });
// game.attack({ userId: 1, opponentId: 2 });
// // game.attack({ userId: 2, opponentId: 1 });
// game.defence({ userId: 0, opponentId: 2 });
// game.defence({ userId: 1, opponentId: 2 });
// // game.defence({ userId: 2, opponentId: 0 });
// console.log(game.turns);
