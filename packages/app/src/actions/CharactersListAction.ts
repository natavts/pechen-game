/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { infoButtons } from '../buttons/buttons';

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
