/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import join from 'lodash/join';
import find from 'lodash/find';
import { Game } from './index';

export interface User {
  userId: number;
  name: string;
}

export class GameRoom {
  private count: number;
  private players: User[] = [];

  public game: Game;

  constructor(count: number) {
    this.count = count;
  }
  public join(user: User): void {
    if (this.isFull()) return;
    this.players.push(user);
    if (this.isFull()) this.startGame();
  }

  public isFull(): boolean {
    return this.count === this.players.length;
  }

  public getUsers(): string[] {
    return this.players.map(user => user.name);
  }

  public getUserId(name: User['name']): User['userId'] | undefined {
    const user = find(this.players, { name });
    return user && user.userId;
  }

  public getUsersList(): string {
    const usersList = this.players.map((player, i) => `${i + 1}. @${player.name}`);
    return join(usersList, '\n');
  }

  public checkUserInGame(userId: User['userId']): boolean {
    return !this.players.some(player => player.userId === userId);
  }

  private startGame(): void {
    if (this.game) return;
    this.game = new Game({ players: this.players });
    console.log('game', this.game);
  }
}
