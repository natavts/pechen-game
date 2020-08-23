/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */

import find from 'lodash/find';
import every from 'lodash/every';
import maxBy from 'lodash/maxBy';
import pullAll from 'lodash/pullAll';
// import join from 'lodash/join';
import { Player, Character } from './Player';
import { User } from './GameRoom';
import { persons } from '../mocks/mocks';
// import { getStatus } from './utils';

export enum TurnType {
  attack = 'attack',
  defence = 'defence',
  character = 'character',
}

export interface Turn {
  type: TurnType;
  data: ActionData | CharacterData;
  isConflicted?: boolean;
  round: number;
}

export interface ActionData {
  userId: number;
  opponentId: number;
}

export interface CharacterData {
  userId: number;
  characterName: string;
}

export interface UserStatus {
  username: Player['name'];
  points: number;
  characters: string[];
  attackPlayer: Player['name'];
  defencePlayer: Player['name'];
  opponentAttacks: Player['name'][];
  opponentDefences: Player['name'][];
}

export class Game {
  public round = 1;
  public turn = 1;

  public players: Player[] = [];
  public winners: Player[] = [];
  public events: Turn[] = [];
  public turns: Turn[] = [];
  public rules: Character[] = [];
  public conflictMode = false;
  public conflict = false;

  constructor({ players }: { players: User[] }) {
    this.players = players.map((p, i) => new Player(p, i));
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

  public setTurns(events: Turn[]): void {
    events.forEach(e => {
      if (this.canDoAction(e.data.userId, e.type, e.data.characterName)) {
        console.log('setTurns -> canDoAction', this.canDoAction(e.data.userId, e.type, e.data.characterName), e);
        this.makeTurn(e);
      }
    });
  }

  public getPlayer(userId: User['userId']): Player | undefined {
    return find(this.players, { userId });
  }

  public getCharactersList(userId?: User['userId'] | undefined): string[] {
    if (userId) {
      const currPlayer = this.getPlayer(userId);
      const playersList = this.players.filter(
        player =>
          player?.character.name !== currPlayer?.character.name &&
          !currPlayer?.characters.includes(player.character.name),
      );
      return playersList.map(player => player?.character.name);
    }
    return this.players.map(player => player?.character.name);
  }

  private isCanResolve(): boolean {
    return this.players
      .filter(p => p.conflictType)
      .map(p => this.haveTurns(p.userId, p.conflictType))
      .includes(true);
  }

  public checkTurnEnd(): void {
    if (this.isAllTurns()) {
      console.log('isTurnEnd');
      this.conflict = !every(this.players, { conflictType: null });
      if (this.conflict) {
        console.log('!!!!conflictMode!!!!');
        if (this.isCanResolve()) {
          console.log('checkTurnEnd -> isCanResolve');
          this.conflictMode = this.conflict;
          return;
        }
        console.log('!!! CANT RESOLVE!!!');
        this.players.forEach(p => {
          if (p.conflictType) {
            p[p.conflictType] = null;
          }
        });
      }
      this.conflict = false;
      this.conflictMode = this.conflict;
      console.log('!!! NEXT TURN !!!');

      this.events.push(...this.turns);
      this.turn += 1;
      this.turns = [];

      if (this.isRoundEnd()) {
        console.log('checkTurnEnd -> isRoundEnd');
        this.setPoints();
        this.round += 1;
        this.conflictMode = false;
        this.conflict = false;
        this.players.forEach(p => {
          p.conflictType = null;
          p.attack = null;
          p.defence = null;
          p.characters = [];
          p.priorityId += 1;
          if (p.priorityId === this.players.length) {
            p.priorityId = 0;
          }
        });
        console.log({ players: this.players });
      }

      if (this.isGameOver()) {
        const { points } = maxBy(this.players, 'points') as Player;
        this.winners = this.players.filter(p => p.points === points);
      }
    }
  }

  public isGameOver(): boolean {
    return this.round > this.players.length;
  }

  private setPoints(): void {
    this.players.forEach(player => {
      const { character } = player;

      const victim = player.attack && this.getPlayer(player.attack)?.character.name;
      const attacking = player.defence && this.getPlayer(player.defence)?.character.name;

      if (victim && victim === character.attack) {
        player.points += 2;
      }

      if (attacking && attacking === character.defence) {
        player.points += 1;
      }
    });
  }

  public canDoAction(userId: User['userId'], action: TurnType, characterName?: string): boolean {
    const player = this.getPlayer(userId);
    if (!player) return false;
    if (this.conflictMode) {
      console.log('canDoAction -> this.conflictMode', this.conflictMode);
      return !!player.conflictType && action === player.conflictType;
    }
    if (this.turns.filter(t => t.data.userId === userId).length) {
      return false;
    }
    if (action === TurnType.character && characterName) {
      return !player.characters.includes(characterName);
    }
    // console.log('!!!canDoAction!!', !player[action], player);
    return this.haveTurns(userId, action);
  }

  private getConflictTurnType(type: TurnType): TurnType {
    return type === TurnType.attack ? TurnType.defence : TurnType.attack;
  }

  private checkConflict({ type, data }: Turn): void {
    const player = this.getPlayer(data.userId);
    const opponent = this.getPlayer((data as ActionData).opponentId);

    const conflictAction = this.getConflictTurnType(type);

    if (opponent && opponent[conflictAction] === player!.userId) {
      const { conflictPlayer, conflictTurnType } =
        player!.priorityId < opponent!.priorityId
          ? { conflictPlayer: opponent, conflictTurnType: conflictAction }
          : { conflictPlayer: player!, conflictTurnType: type };

      conflictPlayer.conflictType = conflictTurnType;
      const conflictedTurn = find(this.turns, {
        data: { userId: conflictPlayer.userId, opponentId: conflictPlayer[conflictTurnType] },
      }) as Turn;
      conflictedTurn.isConflicted = true;
    }
  }

  public makeTurn(turnData: Omit<Turn, 'round'>): void {
    const turn = { ...turnData, round: this.round };
    const { type, data } = turn;
    this.turns.push(turn);

    const player = this.getPlayer(data.userId);

    if (!player) return;

    if (type !== TurnType.character) {
      player[type] = (data as ActionData).opponentId;
      if (this.conflictMode) {
        player.conflictType = null;
      }
      this.checkConflict(turn);
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

  public getAvalibleCharacters(userId: number): string[] {
    const all = this.getCharactersList(userId);
    const except = this.getPlayer(userId)?.characters;
    return pullAll(all, except);
  }

  public getActionForUser(userId: number, type: TurnType): any[] {
    const player = this.getPlayer(userId);
    if (type === TurnType.character) {
      return this.getCharactersList(userId);
    }
    const opponents = this.getOpponentActionEventsList(userId, this.getConflictTurnType(type), this.events).map(
      event => event.data.userId,
    );
    if (this.conflict && player?.conflictType === type) {
      const conflictOpponents = this.getOpponentActionEventsList(userId, this.getConflictTurnType(type), [
        ...this.events,
        ...this.turns,
      ]).map(event => event.data.userId);
      console.log(
        'getActionForUser conflictMode',
        userId,
        type,
        conflictOpponents,
        this.players.filter(
          p => p.userId !== player?.userId && p.userId !== player[type] && !conflictOpponents.includes(p.userId),
        ),
      );
      return this.players.filter(
        p => p.userId !== player?.userId && p.userId !== player[type] && !conflictOpponents.includes(p.userId),
      );
    }
    // console.log('opponents', userId, this.getConflictTurnType(type), opponents);
    return player?.[type] ? [] : this.players.filter(p => p.userId !== player?.userId && !opponents.includes(p.userId));
  }

  public haveTurns(userId: number, type: TurnType): boolean {
    return !!this.getActionForUser(userId, type).length;
  }

  public haveAnyTurns(userId: number): boolean {
    console.log(
      'haveAnyTurnshaveAnyTurnshaveAnyTurnshaveAnyTurns',
      persons.filter(c => this.canDoAction(userId, TurnType.character, c)),
    );
    return (
      this.canDoAction(userId, TurnType.attack) ||
      this.canDoAction(userId, TurnType.defence) ||
      !!persons.filter(c => this.canDoAction(userId, TurnType.character, c)).length
    );
  }

  private isAllTurns(): boolean {
    return this.turns.length >= this.players.length || this.isRoundEnd();
  }

  public isRoundEnd(): boolean {
    const canAttack = this.players.map(p => this.haveTurns(p.userId, TurnType.attack)).includes(true);
    // console.log(
    //   'isRoundEnd -> canAttack',
    //   canAttack,
    //   this.players.map(p => this.haveTurns(p.userId, TurnType.attack)),
    // );
    const canDefence = this.players.map(p => this.haveTurns(p.userId, TurnType.defence)).includes(true);
    console.log('isRoundEnd -> canDefence', canDefence);

    return !canAttack && !canDefence;
  }

  private getOpponentActionEventsList(
    userId: User['userId'],
    type: TurnType.attack | TurnType.defence,
    events: Turn[],
  ): Turn[] {
    return events.filter(
      event =>
        event.round === this.round &&
        !event.isConflicted &&
        event.type === TurnType[type] &&
        (event.data as ActionData).opponentId === userId,
    );
  }
  private getOpponentActionList(
    userId: User['userId'],
    type: TurnType.attack | TurnType.defence,
    events: Turn[],
  ): Player['name'][] {
    const opponentActions = this.getOpponentActionEventsList(userId, type, events);
    return opponentActions.map(item => `@${this.getPlayer(item.data.userId)?.name}` || '').filter(i => !!i);
  }

  public getStatusData(): UserStatus[] {
    const data = this.players.map(player => {
      const attackEvent = find(
        this.events.filter(e => !e.isConflicted),
        { type: TurnType.attack, data: { userId: player.userId } },
      );
      const defenceEvent = find(
        this.events.filter(e => !e.isConflicted),
        { type: TurnType.defence, data: { userId: player.userId } },
      );

      console.log(player.characters);

      return {
        username: player.name,
        points: player.points,
        characters: player.characters,
        attackPlayer: (attackEvent && this.getPlayer(attackEvent.data.opponentId)?.name) || '',
        defencePlayer: (defenceEvent && this.getPlayer(defenceEvent.data.opponentId)?.name) || '',
        opponentAttacks: this.getOpponentActionList(player.userId, TurnType.attack, this.events),
        opponentDefences: this.getOpponentActionList(player.userId, TurnType.defence, this.events),
      };
    });
    return data;
  }
}

// const game = new Game({ players: mockPlayers });
// game.setTurns(mockEvents);

// console.log('========================================');
// console.log('========================================');
// console.log('========================================');
// console.log(game.turns);
// console.log(game.getStatusData());
// // game.attack({ userId: 0, opponentId: 1 });
// // console.log(game.canDoAction(0, TurnType.attack));
// // console.log(getStatus(game.getStatusData()));
// // game.attack({ userId: 1, opponentId: 2 });
// // // game.attack({ userId: 2, opponentId: 1 });
// // game.defence({ userId: 0, opponentId: 2 });
// // game.defence({ userId: 1, opponentId: 2 });
// // // game.defence({ userId: 2, opponentId: 0 });
// // console.log(game.turns);

// console.log('========================================');
// console.log('========================================');
// console.log('========================================');
