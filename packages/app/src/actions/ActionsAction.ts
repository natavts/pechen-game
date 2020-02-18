/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class ActionsAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'ActionsAction';
  }

  private actionsButtons = Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(['🗡 Атаковать', '🛡 Защищаться', '⬅ Назад']);
  });

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Ходить/) != null;
  }

  public exec(message: IncomingMessage): void {
    const chatId = message.from?.id;
    if (!chatId) return;
    this.bot.telegram.sendMessage(chatId, 'Выберите действие', this.actionsButtons); // refresh
  }
}
