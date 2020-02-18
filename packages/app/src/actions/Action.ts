import { Telegram } from 'telegraf';
// eslint-disable-next-line import/no-unresolved
import { GameRoom } from 'game/GameRoom';

export type ActionProps = {
  bot: Telegram;
  gameRoom: GameRoom;
  [name: string]: any;
};

export interface IAction {
  // new (props: ActionProps): Action;
  bot: Telegram;
  name: string;
  log(): void;
  test?(): boolean;
  exec?(): void;
}

export default class Action implements IAction {
  public bot: Telegram;
  public gameRoom: GameRoom;
  public name: string;
  constructor(props: ActionProps) {
    const { bot, gameRoom } = props;
    this.bot = bot;
    this.gameRoom = gameRoom;
    this.name = 'Action';
  }

  // test(message) {
  // }

  public log(...args: any[]): void {
    if (__DEV__) {
      console.log(`[${this.name}]`, ...args); // eslint-disable-line no-console
    }
  }
}
