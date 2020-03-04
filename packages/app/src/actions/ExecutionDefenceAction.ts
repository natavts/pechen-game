/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import { TurnType } from '../game';
import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons';
import { getStatus } from '../game/utils';

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
      game.defence({ userId, opponentId });
      this.bot.telegram.sendMessage(userId, `Защищаюсь от @${opponentName}!!!!`, menuButtons); // refresh
      if (game.isRoundEnd()) {
        game.players.forEach(user => {
          this.bot.telegram.sendMessage(user.userId, getStatus(game.getStatusData()), menuButtons); // refresh
        });
      }
    } else {
      this.bot.telegram.sendMessage(userId, 'нахой'); // refresh
    }
  }
}
