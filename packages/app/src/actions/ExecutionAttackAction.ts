/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import { TurnType } from '../game';
import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons';

export class ExecutionAttackAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'ExecutionAttackAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/🗡 /) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId || !message.text) return;
    const opponentName = message.text.replace('🗡 ', '');
    const opponentId = this.gameRoom.getUserId(opponentName);
    if (opponentId && opponentId !== userId && this.gameRoom.game.canDoAction(userId, TurnType.attack)) {
      this.gameRoom.game.attack({ userId, opponentId });
      this.bot.telegram.sendMessage(userId, `АТАКУЮ @${opponentName}!!!!`, menuButtons); // refresh
      return;
    }
    this.bot.telegram.sendMessage(userId, 'Нет такого игрока');
  }
}
