import Telegraf from 'telegraf';

export const menuButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['👤 Кто я?', '⚔ Ходить', 'Правила', 'Статус']);
});

export const actionsButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['⚔ Атаковать', '☘ Защищаться', '📢 Я не...', '📝 Инфо...', '⬅ Назад']);
});

export const infoButtons = Telegraf.Extra.markdown().markup(m => {
  return m.keyboard(['🎲 Список игроков', '🎭 Список персонажей', '⬅ Назад']);
});
