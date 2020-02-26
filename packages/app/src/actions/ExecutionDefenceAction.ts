/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons/buttons';

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
    const opponentName = message.text.replace('🛡 ', '');
    const opponentId = this.gameRoom.getUserId(opponentName);
    if (opponentId) {
      this.gameRoom.game.defence({ userId, opponentId });
      this.bot.telegram.sendMessage(userId, `Защищаюсь от @${opponentName}!!!!`, menuButtons); // refresh
    } else {
      this.bot.telegram.sendMessage(userId, 'нахой'); // refresh
    }
  }
}
