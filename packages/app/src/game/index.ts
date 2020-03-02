/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */

import find from 'lodash/find';
// import join from 'lodash/join';
import { Player, Character } from './Player';
import { User } from './GameRoom';
import {
  persons,
  // mockPlayers
} from '../mocks/mocks';
// import { getStatus } from './utils';

export enum TurnType {
  attack = 'attack',
  defence = 'defence',
  character = 'character',
}

interface Turn {
  type: TurnType;
  data: ActionData | CharacterData;
}

export interface ActionData {
  userId: number;
  opponentId: number;
}

export interface CharacterData {
  userId: number;
  characterName: string;
}

export interface StatusData {
  round: number;
  data: UserStatus[];
}

export interface UserStatus {
  username: Player['name'];
  points: number;
  characterNames: string[];
  attackPlayer: Player['name'];
  defencePlayer: Player['name'];
  opponentAttacksList: Player['name'][];
  opponentDefencesList: Player['name'][];
}

export class Game {
  public round = 0;
  public turn = 0;

  public players: Player[] = [];
  public events: Turn[] = [];
  public turns: Turn[] = [];
  public rules: Character[] = [];

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
    this.initRules(this.players.length);
    this.players = this.players.map((player, i) => ({
      ...player,
      character: this.rules[i],
    }));
  }

  public initRules(count: number): void {
    const characters = persons.slice(0, count);
    this.rules = characters.map((person, i) => ({
      name: characters[i],
      attack: characters[i + 1] || characters[0],
      defence: characters[i - 1] || characters[characters.length - 1],
    }));
  }

  public getPlayer(userId: User['userId']): Player | undefined {
    return find(this.players, { userId });
  }

  public getCharactersList(userId: User['userId'] | undefined): string[] {
    if (userId) {
      const playersList = this.players.filter(
        player => player?.character.name !== this.getPlayer(userId)?.character.name,
      );
      return playersList.map(player => player?.character.name);
    }
    return this.players.map(player => player?.character.name);
  }

  public checkTurnEnd(): void {
    if (this.isTurnEnd()) {
      console.log('isTurnEnd');
      this.events.push(...this.turns);
      this.turn += 1;
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

  public canDoAction(userId: User['userId'], action: TurnType, characterName?: string): boolean {
    const player = this.getPlayer(userId);
    if (!player) return false;
    if (action === TurnType.character && characterName) {
      return !player.characters.includes(characterName);
    }
    return !player[action];
  }

  public makeTurn(turn: Turn): void {
    this.turns.push(turn);

    const { type, data } = turn;
    const player = this.getPlayer(data.userId);
    // TODO: лишняя проверка
    if (!player) return;

    if (type !== TurnType.character) {
      player[type] = (data as ActionData).opponentId;
    } else {
      player.characters.push((data as CharacterData).characterName);
    }

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
      type: TurnType.character,
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

  private getOpponentActionList(userId: User['userId'], type: TurnType.attack | TurnType.defence): Player['name'][] {
    const opponentAttacks = this.events.filter(
      event => event.type === TurnType[type] && (event.data as ActionData).opponentId === userId,
    );
    return opponentAttacks.map(item => this.getPlayer(item.data.userId)?.name || '').filter(i => !!i);
  }

  public getStatusData(): StatusData {
    const data = this.players.map(player => {
      // трэшак
      const attackPlayer = (player.attack && this.getPlayer(player.attack)?.name) || '';
      const defencePlayer = (player.defence && this.getPlayer(player.defence)?.name) || '';

      return {
        username: player.name,
        points: player.points,
        characterNames: player.characters,
        attackPlayer,
        defencePlayer,
        opponentAttacksList: this.getOpponentActionList(player.userId, TurnType.attack),
        opponentDefencesList: this.getOpponentActionList(player.userId, TurnType.defence),
      };
    });
    return {
      round: this.round,
      data,
    };
  }
}

// const game = new Game({ players: mockPlayers });

// console.log(game.getPlayer(0)?.characterName);
// game.attack({ userId: 0, opponentId: 1 });
// console.log(game.canDoAction(0, TurnType.attack));
// console.log(getStatus(game.getStatusData()));
// game.attack({ userId: 1, opponentId: 2 });
// // game.attack({ userId: 2, opponentId: 1 });
// game.defence({ userId: 0, opponentId: 2 });
// game.defence({ userId: 1, opponentId: 2 });
// // game.defence({ userId: 2, opponentId: 0 });
// console.log(game.turns);
