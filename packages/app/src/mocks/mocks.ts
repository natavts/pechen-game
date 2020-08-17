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
  // turn 1
  {
    type: 'attack',
    data: {
      userId: 1,
      opponentId: 2,
    },
  },
  {
    type: 'defence',
    data: {
      userId: 2,
      opponentId: 1,
    },
  },
  {
    type: 'defence',
    data: {
      userId: 3,
      opponentId: 2,
    },
  },
  {
    type: 'defence',
    data: {
      userId: 2,
      opponentId: 3,
    },
  },
  // turn 2
  {
    type: 'defence',
    data: {
      userId: 1,
      opponentId: 3,
    },
  },
  {
    type: 'attack',
    data: {
      userId: 2,
      opponentId: 3,
    },
  },
  {
    type: 'attack',
    data: {
      userId: 3,
      opponentId: 1,
    },
  },
];
