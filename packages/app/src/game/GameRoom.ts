/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
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

  public checkUserInGame(user: User): boolean {
    return !this.players.some(player => player.userId === user.userId);
  }

  private startGame(): void {
    if (this.game) return;
    this.game = new Game({ players: this.players });
    console.log('game', this.game);
  }
}
