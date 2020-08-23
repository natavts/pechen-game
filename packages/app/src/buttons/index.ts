import Telegraf from 'telegraf';
import { Game } from '../game';

export const menuButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['👤 Кто я?', '⚔ Ходить', 'Правила', 'Статус']);
});

export const actionsButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['⚔ Атаковать', '☘ Защищаться', '📢 Я не...', '🏠 Главное меню']);
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
