/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { actionsButtons } from '../buttons/buttons';

export class ActionsAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'ActionsAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Ходить/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    this.bot.telegram.sendMessage(userId, 'Выберите действие', actionsButtons); // refresh
  }
}
