import {SUITS, VALUES, VALUE_RANKS, GAME_POINT_VALUES} from './deck/constants'
import {generateCards} from './deck/tools'

export class Deck {
    cards = [];
    cardsInPlay = [];

    constructor(
        suits = SUITS, 
        values = VALUES, 
        valueRanks = VALUE_RANKS, 
        gamePointValues = GAME_POINT_VALUES
    ) {
        this.cards = generateCards(suits, values, valueRanks, gamePointValues)
    }
}
