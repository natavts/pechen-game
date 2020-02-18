/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class JoinAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'JoinAction';
  }

  private menuButtons = Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(['👤 Кто я?', '⚔ Ходить', 'Статус']);
  });

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Присоединиться/) != null;
  }

  public exec(message: IncomingMessage): void {
    const chatId = message.from?.id;
    if (!chatId) return;
    if (this.gameRoom.checkUserInGame({ userId: chatId })) {
      this.gameRoom.join({ userId: chatId, name: message.from.username });
      this.bot.telegram.sendMessage(chatId, '⏱ Ждем остальных...'); // refresh
    } else {
      this.bot.telegram.sendMessage(chatId, 'Ты уже в игре, дэбил 🙅 ');
    }
    if (this.gameRoom.isFull()) {
      this.bot.telegram.sendMessage(chatId, '👾 Игра началась', this.menuButtons);
      return;
    }
    // this.bot.telegram.sendMessage(chatId, 'Ждем остальных'); // refresh
  }
}
