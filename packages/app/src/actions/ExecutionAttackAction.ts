/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { IncomingMessage } from 'telegraf/typings/telegram-types';

import { TurnType } from '../game';
import Action, { ActionProps } from './Action';
import { getMenuButtons } from '../buttons';
import { startConflictMode, checkRoundEnd } from '../game/utils';

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
    const { game } = this.gameRoom;
    const opponentName = message.text.replace('🗡 ', '');
    const opponentId = this.gameRoom.getUserId(opponentName);
    console.log('ExecutionAttackAction', opponentId, opponentId !== userId, game.canDoAction(userId, TurnType.attack));
    if (opponentId && opponentId !== userId && game.canDoAction(userId, TurnType.attack)) {
      game.attack({ userId, opponentId });
      this.bot.telegram.sendMessage(userId, `АТАКУЮ @${opponentName}!!!!`, getMenuButtons(userId, game));
      if (game.conflictMode) {
        startConflictMode(game, this.bot);
      }
      checkRoundEnd(game, this.bot);
      return;
    }
    this.bot.telegram.sendMessage(userId, 'Нет такого игрока');
  }
}
