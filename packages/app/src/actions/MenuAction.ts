/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons';

export class MenuAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'MenuAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Главное меню/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    this.bot.telegram.sendMessage(userId, 'Выберите действие', menuButtons); // refresh
  }
}
