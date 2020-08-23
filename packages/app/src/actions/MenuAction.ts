/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { IncomingMessage } from 'telegraf/typings/telegram-types';

import Action, { ActionProps } from './Action';
import { getMenuButtons } from '../buttons';

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
    this.bot.telegram.sendMessage(userId, 'Выберите действие', getMenuButtons(userId, this.gameRoom.game));
  }
}
