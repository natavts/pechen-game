/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import { Turn } from '../game';

export const persons = ['Печенька', 'Синий', 'Стронций', '37', 'Персы', 'Косинус'];

export const mockPlayers = [
  {
    userId: 80081115,
    name: 'natavts',
  },
  {
    userId: 2,
    name: 'p2',
  },
  {
    userId: 3,
    name: 'p3',
  },
];

export const mockEvents: Turn[] = [
  // round 1
  {
    type: 'character',
    data: {
      userId: 80081115,
      characterName: 'Печенька',
    },
  },
  {
    type: 'character',
    data: {
      userId: 2,
      characterName: 'Синий',
    },
  },
  {
    type: 'character',
    data: {
      userId: 3,
      characterName: 'Стронций',
    },
  },
  {
    type: 'character',
    data: {
      userId: 80081115,
      characterName: 'Синий',
    },
  },
  {
    type: 'character',
    data: {
      userId: 2,
      characterName: 'Стронций',
    },
  },
  {
    type: 'character',
    data: {
      userId: 3,
      characterName: 'Печенька',
    },
  },
  // {
  //   type: 'defence',
  //   data: {
  //     userId: 80081115,
  //     opponentId: 2,
  //   },
  // },
  {
    type: 'attack',
    data: {
      userId: 2,
      opponentId: 80081115,
    },
  },
  {
    type: 'attack',
    data: {
      userId: 3,
      opponentId: 80081115,
    },
  },
  // {
  //   type: 'defence',
  //   data: {
  //     userId: 2,
  //     opponentId: 3,
  //   },
  // },
  // {
  //   type: 'defence',
  //   data: {
  //     userId: 3,
  //     opponentId: 2,
  //   },
  // },
  // {
  //   type: 'attack',
  //   data: {
  //     userId: 80081115,
  //     opponentId: 2,
  //   },
  // },
  // // round 2
  // {
  //   type: 'attack',
  //   data: {
  //     userId: 80081115,
  //     opponentId: 3,
  //   },
  // },
  // {
  //   type: 'attack',
  //   data: {
  //     userId: 2,
  //     opponentId: 3,
  //   },
  // },
  // {
  //   type: 'defence',
  //   data: {
  //     userId: 3,
  //     opponentId: 2,
  //   },
  // },
  // {
  //   type: 'defence',
  //   data: {
  //     userId: 80081115,
  //     opponentId: 2,
  //   },
  // },
  // {
  //   type: 'defence',
  //   data: {
  //     userId: 2,
  //     opponentId: 80081115,
  //   },
  // },
  // {
  //   type: 'attack',
  //   data: {
  //     userId: 3,
  //     opponentId: 80081115,
  //   },
  // },
  // // round 3
  // {
  //   type: 'attack',
  //   data: {
  //     userId: 3,
  //     opponentId: 2,
  //   },
  // },
  // {
  //   type: 'attack',
  //   data: {
  //     userId: 80081115,
  //     opponentId: 2,
  //   },
  // },
  // {
  //   type: 'defence',
  //   data: {
  //     userId: 2,
  //     opponentId: 3,
  //   },
  // },
  // {
  //   type: 'defence',
  //   data: {
  //     userId: 3,
  //     opponentId: 80081115,
  //   },
  // },
  // {
  //   type: 'attack',
  //   data: {
  //     userId: 2,
  //     opponentId: 3,
  //   },
  // },
];
