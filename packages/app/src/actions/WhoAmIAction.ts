/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class WhoAmIAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'WhoAmIAction';
  }

  private menuButtons = Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(['👤 Кто я?', '⚔ Ходить', 'Статус']);
  });

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Кто я?/) != null;
  }

  public exec(message: IncomingMessage): void {
    const chatId = message.from?.id;
    if (!chatId) return;
    const characterName = this.gameRoom.game.getUserCharacterName(chatId);
    this.bot.telegram.sendMessage(chatId, characterName, this.menuButtons); // refresh
  }
}
