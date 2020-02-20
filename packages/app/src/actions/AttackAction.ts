/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class AttackAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'AttackAction';
  }

  // private actionsButtons = Telegraf.Extra.markdown().markup(m => {
  //   return m.keyboard(this.gameRoom.players.map(player => player.name));
  // });

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Атаковать/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const buttons = this.gameRoom.getUsers(userId);
    this.bot.telegram.sendMessage(
      userId,
      '🗡 Кого атакуем?',
      Telegraf.Extra.markdown().markup(m => {
        return m.keyboard(buttons);
      }),
    ); // refresh
  }
}
