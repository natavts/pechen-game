/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/camelcase */
import { Extra, Markup } from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { Game, TurnType } from '../game';

export const getMenuButtons = (userId: number, game: Game): ExtraEditMessage => {
  return Extra.markdown().markup((m: Markup) => {
    return m.keyboard(['👤 Кто я?', game.haveAnyTurns(userId) ? '⚔ Ходить' : '', 'Правила', 'Статус'].filter(b => !!b));
  });
};

export const actionsButtons = (userId: number, game: Game): ExtraEditMessage => {
  const buttons = [
    game.canDoAction(userId, TurnType.attack) ? '⚔ Атаковать' : '',
    game.canDoAction(userId, TurnType.defence) ? '☘ Защищаться' : '',
    game.getAvalibleCharacters(userId).length ? '📢 Я не...' : '',
    '🏠 Главное меню',
  ].filter(b => !!b);

  return Extra.markdown().markup((m: Markup) => {
    return m.keyboard(buttons);
  });
};

export const actionButtons = (game: Game, actionType: 'attack' | 'defence', userId: number): ExtraEditMessage => {
  const emoji = actionType === 'defence' ? '🛡' : '🗡';
  const buttons = game.getActionForUser(userId, actionType as any).map(player => `${emoji} ${player.name}`);
  buttons.push('🏠 Главное меню');
  return Extra.markdown().markup(m => {
    return m.keyboard(buttons);
  });
};

export const infoButtons = Extra.markdown().markup((m: Markup) => {
  return m.keyboard(['🎲 Список игроков', '🎭 Список персонажей', '🏠 Главное меню']);
});
