/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import { TurnType } from '../game';
import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons/buttons';
import { getStatus } from '../game/utils';

export class ExecutionIAmNotAction extends Action {
  private game = this.gameRoom.game;
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
    if (this.gameRoom.game.canDoAction(userId, TurnType.character, characterName)) {
      const currentTurn = this.game.turn;
      this.game.character({ userId, characterName });
      if (currentTurn !== this.game.turn) {
        this.game.players.forEach(user => {
          this.bot.telegram.sendMessage(user.userId, getStatus(this.game.getStatusData()), menuButtons); // refresh
        });
      } else {
        this.bot.telegram.sendMessage(userId, `📢 Вы сказали всем, что вы не ${characterName}`, menuButtons); // refresh
      }
    } else {
      this.bot.telegram.sendMessage(userId, `нельзя`, menuButtons);
    }
  }
}
