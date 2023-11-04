export enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
}

export interface Player {
  name: string;
  action: PlayerState;
  isTurn: boolean;
  hand: CardProps[];
  tally: number;
  table: CardProps[];
  roundsWon: number;
  wonRound: WonRoundState;
  playedCardThisTurn: boolean;
}

export interface CardProps {
  value: number;
  color: string;
}

export enum PlayerState {
  PLAY = 'play',
  STAND = 'stand',
  ENDTURN = 'endturn',
}

export enum WonRoundState {
  WON = 'won',
  LOST = 'lost',
  TIED = 'tied',
  UNDECIDED = 'undecided',
}
