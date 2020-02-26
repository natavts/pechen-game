/* eslint-disable @typescript-eslint/camelcase */
import join from 'lodash/join';
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons/buttons';

export class RulesAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'RulesAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Правила/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const rules = this.gameRoom.game.rules.map(item => item.name);
    this.bot.telegram.sendMessage(userId, join(rules, ' -> '), menuButtons); // refresh
  }
}
