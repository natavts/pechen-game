/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class DefenceAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'DefenceAction';
  }

  // private actionsButtons = Telegraf.Extra.markdown().markup(m => {
  //   return m.keyboard(this.gameRoom.players.map(player => player.name));
  // });

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Защищаться/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const buttons = this.gameRoom.getUsers().map(user => `🛡 ${user}`);
    this.bot.telegram.sendMessage(
      userId,
      '🛡 От кого защищаемся?',
      Telegraf.Extra.markdown().markup(m => {
        return m.keyboard(buttons);
      }),
    ); // refresh
  }
}
