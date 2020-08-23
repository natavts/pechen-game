/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import join from 'lodash/join';
import { Telegram } from 'telegraf';
import { StatusData, Game } from '.';
import { actionButtons, menuButtons } from '../buttons';

export const getStatus = ({ round, data }: StatusData): string => {
  return `Раунд: ${round}\n
  ${data.map(({ username, points, characters, attackPlayer, defencePlayer, opponentAttacks, opponentDefences }) => {
    return `
    @${username} (Очки: ${points})
    Ходы: ${join(characters, ', ')}
    Атаковал: ${attackPlayer}
    Защитился: ${defencePlayer}
    Кто атаковал: ${join(opponentAttacks, ', ')}
    Кто защитился: ${join(opponentDefences, ', ')}\n\n\n`;
  })}
  `;
};

export const startConflictMode = (game: Game, bot: Telegram): void => {
  const conflictPlayers = game.players.filter(p => p.conflictType);
  conflictPlayers.forEach(player => {
    const action = player.conflictType === 'attack' ? 'атаковать' : 'защищаться от';
    const opponent = game.getPlayer(player[player.conflictType!]);
    const buttons = actionButtons(game, player.conflictType as any, player.userId);
    bot.telegram.sendMessage(player.userId, `Вы не можете ${action} @${opponent?.name}`, buttons);
  });
  game.players
    .filter(p => !p.conflictType)
    .forEach(player => {
      bot.telegram.sendMessage(player.userId, `Конфликтный режим. Ждем, когда игроки сделают ход`, menuButtons);
    });
};

export const checkRoundEnd = (game: Game, bot: Telegram) => {
  if (game.isRoundEnd()) {
    game.players.forEach(user => {
      bot.telegram.sendMessage(user.userId, getStatus(game.getStatusData()), menuButtons);
    });
  }
  if (game.isGameOver()) {
    if (!game.winners.length) {
      return;
    }
    game.players.forEach(user => {
      bot.telegram.sendMessage(
        user.userId,
        game.winners.map(w => `Победил @${w!.name}. Набрал ${w!.points}`).join('\n'),
        menuButtons,
      );
    });
  }
};
