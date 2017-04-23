import * as _ from 'lodash';

import {SUITS, VALUES, VALUE_RANKS, GAME_POINT_VALUES} from './deck/constants'

export class Card {
    name: string;
    suit: string;
    value: string;
    rank: number;
    gamePoints: number;

    constructor(suit, value, rank = undefined, gamePoints = undefined) {
        this.name = `${value} of ${suit}`
        this.suit = suit;
        this.value = value;
        this.rank = rank;
        this.gamePoints = gamePoints
    }
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
        _.each(suits, suit => {
            _.each(values, value => {
                this.cards.push(new Card(suit, value, valueRanks[value], gamePointValues[value]));
            });
        });
    }
}
