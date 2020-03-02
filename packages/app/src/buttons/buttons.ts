import Telegraf from 'telegraf';

export const menuButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['👤 Кто я?', '⚔ Ходить', 'Правила', 'Статус']);
});

export const actionsButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['⚔ Атаковать', '☘ Защищаться', '📢 Я не...', '🏠 Главное меню']);
});

export const infoButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['🎲 Список игроков', '🎭 Список персонажей', '🏠 Главное меню']);
});
