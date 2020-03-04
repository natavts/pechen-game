/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import pullAll from 'lodash/pullAll';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class IAmNotAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'IAmNotAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Я не.../) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const { game } = this.gameRoom;
    const all = game.getCharactersList(userId);
    const except = game.getPlayer(userId)?.characters;
    const buttons = pullAll(all, except).map(character => `🙅 ${character}`);

    buttons.push('🏠 Главное меню');
    this.bot.telegram.sendMessage(
      userId,
      '📢 Скажите всем кем вы не являетесь?',
      Telegraf.Extra.markdown().markup(m => {
        return m.keyboard(buttons);
      }),
    ); // refresh
  }
}
