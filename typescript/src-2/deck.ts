import {SUITS, VALUES, VALUE_RANKS, GAME_POINT_VALUES} from './constants'

export class Deck {
    cards

    constructor(
        suits = SUITS, 
        values = VALUES, 
        valueRanks = VALUE_RANKS, 
        gamePointValues = GAME_POINT_VALUES
    ) {
        this.cards = generateCards(suits, values, valueRanks, gamePointValues)
    }
}
