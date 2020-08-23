/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { IncomingMessage } from 'telegraf/typings/telegram-types';
// import find from 'lodash/find';

import Action, { ActionProps } from './Action';
import { getMenuButtons } from '../buttons';

export class WhoAmIAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'WhoAmIAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Кто я?/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const character = this.gameRoom.game.getPlayer(userId)?.character;
    this.bot.telegram.sendMessage(
      userId,
      `⚪️ Вы: ${character?.name}\n
      🔴 Должны атаковать: ${character?.attack}\n
      🔵 Должны защититься от: ${character?.defence}`,
      getMenuButtons(userId, this.gameRoom.game),
    ); // refresh
  }
}
