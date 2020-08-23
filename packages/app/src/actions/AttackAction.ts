/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { actionButtons } from '../buttons';

export class AttackAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'AttackAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Атаковать/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    this.bot.telegram.sendMessage(userId, '💣 Кого атакуем?', actionButtons(this.gameRoom.game, 'attack', userId));
  }
}
