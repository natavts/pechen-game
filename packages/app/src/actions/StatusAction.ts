/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { IncomingMessage } from 'telegraf/typings/telegram-types'; // eslint-disable-line
import find from 'lodash/find';
import join from 'lodash/join';

import Action, { ActionProps } from './Action'; // eslint-disable-line
import { menuButtons } from '../buttons/buttons';

export class StatusAction extends Action {
  constructor(props: ActionProps) {
    super(props);
    this.name = 'StatusAction';
  }

  public test(message: IncomingMessage): boolean {
    if (!message.text) return false;
    return message.text.match(/Статус/) != null;
  }

  public exec(message: IncomingMessage): void {
    const userId = message.from?.id;
    if (!userId) return;
    const round = this.gameRoom.game.round;
    const username = message.from?.username;
    const points = this.gameRoom.game.getPlayer(userId)?.points;

    const attack = find(this.gameRoom.game.events, { type: 'attack', data: { userId } });
    const defence = find(this.gameRoom.game.events, { type: 'defence', data: { userId } });

    const opponentAttacks = this.gameRoom.game.events.filter(
      event => event.type === 'attack' && event.data.opponentId === userId,
    );
    const opponentDefences = this.gameRoom.game.events.filter(
      event => event.type === 'defence' && event.data.opponentId === userId,
    );
    const characters = this.gameRoom.game.events.filter(
      event => event.type === 'character' && event.data.userId === userId,
    );

    let attackPlayer = '';
    if (attack) {
      attackPlayer = `@${this.gameRoom.game.getPlayer(attack.data.opponentId)?.name}`;
    }
    let defencePlayer = '';
    if (defence) {
      defencePlayer = `@${this.gameRoom.game.getPlayer(defence.data.opponentId)?.name}`;
    }

    let opponentAttacksList = [];
    if (opponentAttacks) {
      opponentAttacksList = opponentAttacks.map(item => `@${this.gameRoom.game.getPlayer(item.data.userId)?.name}`);
    }
    let opponentDefencesList = [];
    if (opponentDefences) {
      opponentDefencesList = opponentDefences.map(item => `@${this.gameRoom.game.getPlayer(item.data.userId)?.name}`);
    }
    let characterNames = [];
    if (characters) {
      characterNames = characters.map(item => item.data.characterName);
    }
    // const character = this.gameRoom.game.getPlayer(userId)?.character;
    this.bot.telegram.sendMessage(
      userId,
      `Раунд: ${round}\n
      @${username} (Очки: ${points})\n
      Ходы: ${join(characterNames, ', ')}\n
      Атаковал: ${attackPlayer}\n
      Защитился: ${defencePlayer}\n
      Кто атаковал: ${join(opponentAttacksList, ', ')}\n
      Кто защитился: ${join(opponentDefencesList, ', ')}\n
      `,
      menuButtons,
    ); // refresh
  }
}
