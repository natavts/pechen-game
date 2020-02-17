/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */

import find from 'lodash/find';
// eslint-disable-next-line import/no-unresolved
import { Player, PlayerProps } from './Player';

const mockPlayers = [
  {
    userId: '0',
    name: 'p1',
  },
  {
    userId: '1',
    name: 'p2',
  },
  {
    userId: '2',
    name: 'p3',
  },
];

const persons = [
  {
    name: 'Печенька',
    attack: 'Синий',
    defence: 'Персы',
  },
  {
    name: 'Синий',
    attack: 'Персы',
    defence: 'Печенька',
  },
  {
    name: 'Персы',
    attack: 'Печенька',
    defence: 'Синий',
  },
];

type TurnType = 'attack' | 'defence' | 'character';

interface Turn {
  type: TurnType;
  data: ActionData | CharacterData;
}

interface ActionData {
  userId: string;
  opponentId: string;
}

interface CharacterData {
  userId: string;
  characterName: string;
}

class Game {
  public round = 0;

  private players: Player[] = [];
  private events: Turn[] = [];
  public turns: Turn[] = [];

  constructor({ players }: { players: PlayerProps[] }) {
    this.players = players.map(p => new Player(p));
    this.start();
  }

  public start(): void {
    this.initCharacters();
    this.events = [];
    this.turns = [];
  }

  private initCharacters(): void {
    this.players = this.players.map((player, i) => {
      player.character = persons[i];
      return player;
    });
  }

  public getUserCharacterName(userId: string): string | undefined {
    const player = find(this.players, { userId });
    return player && player.character.name;
  }

  public checkTurnEnd(): void {
    if (this.isTurnEnd()) {
      console.log('isTurnEnd');
      this.events.push(...this.turns);
      this.turns = [];
      if (this.isRoundEnd()) {
        // checkConflict
        this.setPoints();
        console.log({ players: this.players });
      }
    }
  }

  private setPoints(): void {
    this.players.forEach(player => {
      const { userId, character } = player;

      const attack = find(this.events, { data: { userId }, type: 'attack' }) as Turn;
      const defence = find(this.events, { data: { userId }, type: 'defence' }) as Turn;

      if (this.getUserCharacterName((attack.data as ActionData).opponentId) === character.attack) {
        player.points += 2;
      }

      if (this.getUserCharacterName((defence.data as ActionData).opponentId) === character.defence) {
        player.points += 1;
      }
    });
  }

  public attack({ userId, opponentId }: ActionData): void {
    this.turns.push({
      type: 'attack',
      data: {
        userId,
        opponentId,
      },
    });
    this.checkTurnEnd();
  }

  public defence({ userId, opponentId }: ActionData): void {
    this.turns.push({
      type: 'defence',
      data: {
        userId,
        opponentId,
      },
    });
    this.checkTurnEnd();
  }

  public character({ userId, characterName }: CharacterData): void {
    this.turns.push({
      type: 'character',
      data: {
        userId,
        characterName,
      },
    });
    this.checkTurnEnd();
  }

  private isTurnEnd(): boolean {
    return this.turns.length === this.players.length;
  }

  private isRoundEnd(): boolean {
    const attacks = this.events.filter(e => e.type === 'attack');
    const defence = this.events.filter(e => e.type === 'defence');

    return attacks.length === this.players.length && defence.length === this.players.length;
  }
}

const game = new Game({ players: mockPlayers });

console.log(game.getUserCharacterName('0'));
game.attack({ userId: '0', opponentId: '1' });
game.attack({ userId: '1', opponentId: '2' });
game.attack({ userId: '2', opponentId: '1' });
game.defence({ userId: '0', opponentId: '2' });
game.defence({ userId: '1', opponentId: '2' });
game.defence({ userId: '2', opponentId: '0' });
console.log(game.turns);
