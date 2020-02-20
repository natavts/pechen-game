/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class CharactersListAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'CharactersListAction';
  }

  private actionsButtons = Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(['🎲 Список игроков', '🎭 Список персонажей', '⬅ Назад']);
  });

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Список персонажей/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const charactersList = this.gameRoom.game.getCharactersList(userId);
    this.bot.telegram.sendMessage(userId, `🎭 Список персонажей:\n\n${charactersList}`, this.actionsButtons); // refresh
  }
}
