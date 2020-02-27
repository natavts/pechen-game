/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import join from 'lodash/join';
import { StatusData } from '.';

export const getStatus = ({ round, data }: StatusData): string => {
  return `Раунд: ${round}\n
  ${data.map(
    ({ username, points, characterNames, attackPlayer, defencePlayer, opponentAttacksList, opponentDefencesList }) => {
      return `@${username} (Очки: ${points})\n
    Ходы: ${join(characterNames, ', ')}\n
    Атаковал: ${attackPlayer}\n
    Защитился: ${defencePlayer}\n
    Кто атаковал: ${join(opponentAttacksList, ', ')}\n
    Кто защитился: ${join(opponentDefencesList, ', ')}\n`;
    },
  )}
  `;
};
