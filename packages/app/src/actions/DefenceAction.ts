import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { actionButtons } from '../buttons'; // eslint-disable-line

export class DefenceAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'DefenceAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Защищаться/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    this.bot.telegram.sendMessage(
      userId,
      '🛡 От кого защищаемся?',
      actionButtons(this.gameRoom.game, 'defence', userId),
    ); // refresh
  }
}
