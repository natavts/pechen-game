/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons';

export class JoinAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'JoinAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Присоединиться/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId || !message.from) return;
    if (this.gameRoom.checkUserInGame(userId)) {
      // TODO: придумать что делать с чуваками без юзернейма
      this.gameRoom.join({ userId, name: message.from.username });
      this.bot.telegram.sendMessage(userId, '⏱ Ждем остальных...'); // refresh
    } else {
      this.bot.telegram.sendMessage(userId, 'Ты уже в игре, дэбил 🙅 ');
    }
    if (this.gameRoom.isFull()) {
      this.gameRoom.game.players.forEach(user => {
        this.bot.telegram.sendMessage(user.userId, '👾 Игра началась!', menuButtons);
      });
    }
    // this.bot.telegram.sendMessage(userId, 'Ждем остальных'); // refresh
  }
}
