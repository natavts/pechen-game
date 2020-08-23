/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage, ExtraEditMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { getMenuButtons } from '../buttons';

export class JoinAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'JoinAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Присоединиться/) != null;
  }

  private send(userId: number, message: string, options: ExtraEditMessage = {}): void {
    this.bot.telegram.sendMessage(userId, message, options);
  }

  // TODO: придумать что делать с чуваками без юзернейма
  private checkFull(message: { from: { id: number; username: string } }): void {
    const userId = message.from.id;

    if (!this.gameRoom.isFull()) {
      this.gameRoom.join({ userId, name: message.from.username });
      this.send(userId, '⏱ Ждем остальных...'); // refresh
    } else {
      this.send(userId, 'МЫ УЖЕ ИГРАЕМ А ТЫ ИДИ НАХУЙ!');
    }
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id as number;
    if (!userId || !message.from) return;

    if (!this.gameRoom.checkUserInGame(userId)) {
      this.checkFull(message as any);
    } else {
      this.send(userId, 'Ты уже в игре, дэбил 🙅 ');
    }

    if (this.gameRoom.isFull() && this.gameRoom.checkUserInGame(userId)) {
      this.gameRoom.game.players.forEach(user => {
        this.send(user.userId, '👾 Игра началась!', getMenuButtons(userId, this.gameRoom.game));
      });
    }
  }
}
