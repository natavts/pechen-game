/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import join from 'lodash/join';
import { StatusData } from '.';

export const getStatus = ({ round, data }: StatusData): string => {
  return `Раунд: ${round}\n
  ${data.map(({ username, points, characters, attackPlayer, defencePlayer, opponentAttacks, opponentDefences }) => {
    return `@${username} (Очки: ${points})\n
    Ходы: ${join(characters, ', ')}\n
    Атаковал: ${attackPlayer}\n
    Защитился: ${defencePlayer}\n
    Кто атаковал: ${join(opponentAttacks, ', ')}\n
    Кто защитился: ${join(opponentDefences, ', ')}\n`;
  })}
  `;
};
