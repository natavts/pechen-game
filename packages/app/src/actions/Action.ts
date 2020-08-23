import Telegraf, { ContextMessageUpdate } from 'telegraf';

// eslint-disable-next-line import/no-unresolved
import { GameRoom } from 'game/GameRoom';

export type ActionProps = {
  bot: Telegraf<ContextMessageUpdate>;
  gameRoom: GameRoom;
  [name: string]: any;
};

export default class Action {
  public bot: Telegraf<ContextMessageUpdate>;
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
