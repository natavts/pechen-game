/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */

import find from 'lodash/find';
import { Player } from './Player';
import { User } from './GameRoom';

const mockPlayers = [
  {
    userId: 0,
    name: 'p1',
  },
  {
    userId: 1,
    name: 'p2',
  },
];

const persons = [
  {
    name: 'Печенька',
    attack: 'Синий',
    defence: 'Синий',
  },
  {
    name: 'Синий',
    attack: 'Печенька',
    defence: 'Печенька',
  },
  // {
  //   name: 'Персы',
  //   attack: 'Печенька',
  //   defence: 'Синий',
  // },
];

type TurnType = 'attack' | 'defence' | 'character';

interface Turn {
  type: TurnType;
  data: ActionData | CharacterData;
}

interface ActionData {
  userId: number;
  opponentId: number;
}

interface CharacterData {
  userId: number;
  characterName: string;
}

export class Game {
  public round = 0;

  private players: Player[] = [];
  private events: Turn[] = [];
  public turns: Turn[] = [];

  constructor({ players }: { players: User[] }) {
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

  public getPlayer(userId: User['userId']): Player | undefined {
    return find(this.players, { userId });
  }

  // public getUserCharacterName(userId: User['userId']): string | undefined {
  //   return this.getPlayer(userId) && this.getPlayer(userId).characterName;
  // }

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
      
      const victimPlayer = this.getPlayer((attack.data as ActionData).opponentId)?.characterName;
      const attackingPlayer = this.getPlayer((defence.data as ActionData).opponentId)?.characterName;

      if (victimPlayer === character.attack) {
        player.points += 2;
      }

      if (attackingPlayer === character.defence) {
        player.points += 1;
      }
    });
  }

  public makeTurn(turn: Turn):void {
    this.turns.push(turn);
    this.checkTurnEnd();
  }

  public attack({ userId, opponentId }: ActionData): void {
    const turn = {
      type: 'attack',
      data: {
        userId,
        opponentId,
      },
    };
    this.makeTurn(turn);
  }

  public defence({ userId, opponentId }: ActionData): void {
    const turn = {
      type: 'defence',
      data: {
        userId,
        opponentId,
      },
    };
    this.makeTurn(turn);
  }

  public character({ userId, characterName }: CharacterData): void {
    const turn = {
      type: 'character',
      data: {
        userId,
        characterName,
      },
    };
    this.makeTurn(turn);
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

console.log(game.getPlayer('0')?.characterName);
game.attack({ userId: 0, opponentId: 1 });
game.attack({ userId: 1, opponentId: 2 });
// game.attack({ userId: 2, opponentId: 1 });
game.defence({ userId: 0, opponentId: 2 });
game.defence({ userId: 1, opponentId: 2 });
// game.defence({ userId: 2, opponentId: 0 });
console.log(game.turns);
