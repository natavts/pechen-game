/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import join from 'lodash/join';
import { StatusData } from '.';

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
