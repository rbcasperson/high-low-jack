import {SUITS, VALUES, VALUE_RANKS, GAME_POINT_VALUES} from './deck/constants'
import {generateCards} from './deck/tools'

export interface Card {
    name: string,
    suit: string,
    value: string,
    rank: number,
    gamePoints: number
};

export class Deck {
    cards: Card[] = [];
    cardsInPlay: Card[] = [];

    constructor(
        suits = SUITS, 
        values = VALUES, 
        valueRanks = VALUE_RANKS, 
        gamePointValues = GAME_POINT_VALUES
    ) {
        this.cards = generateCards(suits, values, valueRanks, gamePointValues)
    }
}
