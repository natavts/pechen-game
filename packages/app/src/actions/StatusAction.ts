/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { IncomingMessage } from 'telegraf/typings/telegram-types';

import Action, { ActionProps } from './Action';
import { getStatus } from '../game/utils';
import { getMenuButtons } from '../buttons';

export class StatusAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'StatusAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Статус/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    this.bot.telegram.sendMessage(userId, getStatus(this.gameRoom.game), getMenuButtons(userId, this.gameRoom.game)); // refresh
  }
}
