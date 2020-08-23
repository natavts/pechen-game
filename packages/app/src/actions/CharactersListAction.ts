/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { IncomingMessage } from 'telegraf/typings/telegram-types';

import Action, { ActionProps } from './Action';
import { infoButtons } from '../buttons';

export class CharactersListAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'CharactersListAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Список персонажей/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const charactersList = this.gameRoom.game.getCharactersList();
    this.bot.telegram.sendMessage(userId, `🎭 Список персонажей:\n\n${charactersList}`, infoButtons); // refresh
  }
}
