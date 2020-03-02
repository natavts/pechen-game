/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { infoButtons } from '../buttons';

export class InfoAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'InfoAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Инфо.../) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    this.bot.telegram.sendMessage(userId, 'Выберите действие', infoButtons); // refresh
  }
}
