/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class InfoAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'InfoAction';
  }

  private infoButtons = Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(['🎲 Список игроков', '🎭 Список персонажей', '⬅ Назад']);
  });

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Инфо.../) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    this.bot.telegram.sendMessage(userId, 'Выберите действие', this.infoButtons); // refresh
  }
}
