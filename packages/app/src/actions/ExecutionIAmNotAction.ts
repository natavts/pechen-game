/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { IncomingMessage } from 'telegraf/typings/telegram-types';

import { TurnType } from '../game';
import Action, { ActionProps } from './Action';
import { getMenuButtons } from '../buttons';
import { getStatus, startConflictMode } from '../game/utils';

export class ExecutionIAmNotAction extends Action {
  // private game = this.gameRoom.game;
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
    const { game } = this.gameRoom;

    if (game.canDoAction(userId, TurnType.character, characterName)) {
      const currentTurn = game.turn;
      game.makeTurn({ type: TurnType.character, data: { userId, characterName } });

      if (currentTurn !== game.turn) {
        game.players.forEach(user => {
          this.bot.telegram.sendMessage(user.userId, getStatus(game), getMenuButtons(user.userId, game));
        });
      } else {
        this.bot.telegram.sendMessage(
          userId,
          `📢 Вы сказали всем, что вы не ${characterName}`,
          getMenuButtons(userId, game),
        );

        if (game.conflictMode) {
          startConflictMode(game, this.bot);
        }
      }
    } else {
      this.bot.telegram.sendMessage(userId, `нельзя`, getMenuButtons(userId, game));
    }
  }
}
