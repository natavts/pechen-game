import Telegraf from 'telegraf';
import { Game } from '../game';

export const getMenuButtons = (userId: number, game: Game): any => {
  return Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(
      ['👤 Кто я?', game.haveAnyTurns(userId) ? '⚔ Ходить' : null, 'Правила', 'Статус'].filter(b => !!b),
    );
  });
};

export const actionsButtons = (userId: number, game: Game): any =>
  Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(
      [
        game.canDoAction(userId, 'attack') ? '⚔ Атаковать' : null,
        game.canDoAction(userId, 'defence') ? '☘ Защищаться' : null,
        game.getAvalibleCharacters(userId).length ? '📢 Я не...' : null,
        '🏠 Главное меню',
      ].filter(b => !!b),
    );
  });

export const actionButtons = (game: Game, actionType: 'attack' | 'defence', userId: number): any => {
  const emoji = actionType === 'defence' ? '🛡' : '🗡';
  const buttons = game.getActionForUser(userId, actionType as any).map(player => `${emoji} ${player.name}`);
  buttons.push('🏠 Главное меню');
  return Telegraf.Extra.markdown().markup(m => {
    return m.keyboard(buttons);
  });
};

export const infoButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['🎲 Список игроков', '🎭 Список персонажей', '🏠 Главное меню']);
});
