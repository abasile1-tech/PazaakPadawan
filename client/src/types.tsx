import { Client } from 'stompjs';

export interface PlayerPVP {
  name: string;
  action: PlayerState;
  isTurn: boolean;
  hand: CardPropsPVP[];
  tally: number;
  table: CardPropsPVP[];
  roundsWon: number;
  wonRound: WonRoundState;
  playedCardThisTurn: boolean;
}

export interface SoloPlayer {
  name: string;
  action: PlayerState;
  isTurn: boolean;
  hand: JSX.Element[];
  tally: number;
  table: JSX.Element[];
  gamesWon: number;
  playedCardThisTurn: boolean;
}

export interface CardPropsPVP {
  value: number;
  color: string;
}

export interface DeckCard {
  value: number;
  color: string;
  selected: boolean;
  imagePath: string;
}

export interface CardProps {
  key?: number;
  value: number;
  color: string;
  cardType: string;
  selected?: boolean;
  image?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface HandProps {
  hand: Array<JSX.Element>;
  moveCard?: (card: JSX.Element, index: number) => void;
}

export enum PlayerState {
  PLAY = 'play',
  STAND = 'stand',
  ENDTURN = 'endturn',
}

export enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
  STAND = 'stand',
  WAIT = 'wait',
}

export enum WonRoundState {
  WON = 'won',
  LOST = 'lost',
  TIED = 'tied',
  UNDECIDED = 'undecided',
}

export interface UserData {
  username: string;
  receiverName: string;
  connected: boolean;
  message: string;
}

export interface PublicChat {
  senderName: string;
  receiverName: string;
  message: string;
  date: Date;
  status: string;
}

export interface ChatProps {
  stompClient: Client;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export interface PVPGameProps {
  stompClient: Client;
  userData: UserData;
}

export interface Payload {
  body: string;
}

export interface PlayBarPVPProps {
  player: PlayerPVP;
  otherPlayer: PlayerPVP;
}

export interface GameButtonsProps {
  gameState: GameState;
  onStand: () => void;
  onEndTurn: () => void;
  onStartGame: () => void;
  isTurn: boolean;
}

export interface BarComponentProps {
  chosenCharacter: string;
}

export interface Character {
  id: number;
  name: string;
  image: string;
}

export interface TurnIndicatorProps {
  playerName: string;
}

export interface ScoreKeeperProps {
  cardTally: number;
}

export interface MusicChoiceProps {
  musicChoice: string;
}

export interface EndGamePopupPVPProps {
  player: PlayerPVP;
  otherPlayer: PlayerPVP;
  userData: UserData;
  handleGameOverClick: () => void;
}

export interface EndGamePopupProps {
  numGamesWonPlayer: number;
  numGamesWonOpponent: number;
  handleGameOverClick: () => void;
}

export interface PopUpProps {
  title?: string;
  message: string;
  buttonText?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  audiofile?: string;
}
