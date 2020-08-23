/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { IncomingMessage } from 'telegraf/typings/telegram-types';

import Action, { ActionProps } from './Action';
import { infoButtons } from '../buttons';

export class UsersListAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'UsersListAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Список игроков/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const usersList = this.gameRoom.getUsersList();
    this.bot.telegram.sendMessage(userId, `🎲 Список игроков:\n\n${usersList}`, infoButtons); // refresh
  }
}
