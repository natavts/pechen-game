/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import join from 'lodash/join';
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { Game } from '.';
import { actionButtons, getMenuButtons } from '../buttons';

export const getStatus = (game: Game): string => {
  const data = game.getStatusData();
  return `Раунд: ${game.round}\n
  ${data.map(({ username, points, characters, attackPlayer, defencePlayer, opponentAttacks, opponentDefences }) => {
    return `
    @${username} (Очки: ${points})
    Ходы: ${join(characters, ', ')}
    Атаковал: ${attackPlayer && `@${attackPlayer}`}
    Защитился от: ${defencePlayer && `@${defencePlayer}`}
    Кто атаковал @${username}: ${join(opponentAttacks, ', ')}
    Кто защитился от @${username}: ${join(opponentDefences, ', ')}\n\n\n`;
  })}
  `;
};

export const startConflictMode = (game: Game, bot: Telegraf<ContextMessageUpdate>): void => {
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
      bot.telegram.sendMessage(
        player.userId,
        `Конфликтный режим. Ждем, когда игроки сделают ход`,
        getMenuButtons(player.userId, game),
      );
    });
};

export const checkRoundEnd = (game: Game, bot: Telegraf<ContextMessageUpdate>): void => {
  if (game.isRoundEnd()) {
    game.players.forEach(user => {
      bot.telegram.sendMessage(user.userId, getStatus(game), getMenuButtons(user.userId, game));
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
        getMenuButtons(user.userId, game),
      );
    });
  }
};
