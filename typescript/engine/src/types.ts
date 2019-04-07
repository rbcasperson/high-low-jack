import {Card} from './deck';
import {Team} from './team';


export interface CardsByPlayer {
    [playerName: string]: Card;
}

export interface Trick {
    number: number;
    leadSuit: string;
    cardsPlayed: CardsByPlayer;
    leadPlayer: string;
}

export interface Scores {
    [teamName: string]: number;
}

export interface Bid {
    playerName: string;
    amount: number;
}

export interface Teams {
    [teamName: string]: Team;
}

export interface PointsEarned {
    [teamName: string]: string[];
}
