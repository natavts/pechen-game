/* eslint-disable @typescript-eslint/camelcase */
import Telegraf from 'telegraf';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line

export class ExecutionAttackAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'ExecutionAttackAction';
  }

  private actionsButtons = Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(['⚔ Атаковать', '☘ Защищаться', '📝 Инфо...', '⬅ Назад']);
  });

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/🗡 /) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId || !message.text) return;
    const opponentName = message.text.replace('🗡 ', '');
    const opponentId = this.gameRoom.getUserId(opponentName);
    if (opponentId) {
      this.gameRoom.game.attack({ userId, opponentId });
      this.bot.telegram.sendMessage(userId, `АТАКУЮ @${opponentName}!!!!`, this.actionsButtons); // refresh
      return;
    }
    this.bot.telegram.sendMessage(userId, 'Нет такого игрока');
  }
}
