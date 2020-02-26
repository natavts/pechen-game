/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons/buttons';

export class ExecutionIAmNotAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'ExecutionIAmNotAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/🙅 /) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId || !message.text) return;
    const characterName = message.text.replace('🙅 ', '');
    this.gameRoom.game.character({ userId, characterName });
    this.bot.telegram.sendMessage(userId, `📢 Вы сказали всем, что вы не ${characterName}`, menuButtons); // refresh
  }
}
