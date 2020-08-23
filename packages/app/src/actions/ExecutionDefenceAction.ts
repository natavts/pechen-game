/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { IncomingMessage } from 'telegraf/typings/telegram-types';

import { TurnType } from '../game';
import Action, { ActionProps } from './Action';
import { getMenuButtons } from '../buttons';
import { startConflictMode, checkRoundEnd } from '../game/utils';

export class ExecutionDefenceAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'ExecutionDefenceAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/🛡 /) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId || !message.text) return;

    const { game } = this.gameRoom;
    const opponentName = message.text.replace('🛡 ', '');
    const opponentId = this.gameRoom.getUserId(opponentName);

    if (opponentId && opponentId !== userId && game.canDoAction(userId, TurnType.defence)) {
      game.makeTurn({ type: TurnType.defence, data: { userId, opponentId } });
      this.bot.telegram.sendMessage(userId, `Защищаюсь от @${opponentName}!!!!`, getMenuButtons(userId, game));

      if (game.conflictMode) {
        startConflictMode(game, this.bot);
      }

      checkRoundEnd(game, this.bot);
    } else {
      this.bot.telegram.sendMessage(userId, 'нахой');
    }
  }
}
