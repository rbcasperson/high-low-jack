import * as _ from "lodash";

export const SUITS = ["spades", "clubs", "hearts", "diamonds"];
export const VALUES = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
// The rankings of each card
export const VALUE_RANKS = {
    'ace': 1,
    'king': 2,
    'queen': 3,
    'jack': 4,
    '10': 5,
    '9': 6,
    '8': 7,
    '7': 8,
    '6': 9,
    '5': 10,
    '4': 11,
    '3': 12,
    '2': 13
};
// Game point values
export const GAME_POINT_VALUES = {
    'ace': 4,
    'king': 3,
    'queen': 2,
    'jack': 1,
    '10': 10,
    '9': 0,
    '8': 0,
    '7': 0,
    '6': 0,
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0
};

interface ValueRanks {
    [value: string]: number
};

interface GamePointValues {
    [value: string]: number
};

export interface Card {
    name: string,
    suit: string,
    value: string,
    rank: number,
    gamePoints: number
};

export class Deck {
    valueRanks: ValueRanks;
    gamePointValues: GamePointValues
    cards: Card[] = [];
    cardsInPlay: Card[] = [];

    constructor(valueRanks: ValueRanks = VALUE_RANKS, gamePointValues: GamePointValues = GAME_POINT_VALUES,
                values: string[] = VALUES, suits: string[] = SUITS) {
        this.valueRanks = valueRanks;
        this.gamePointValues = gamePointValues
        _.each(suits, suit => {
            _.each(values, value => {
                let card: Card = {
                    name: `${value} of ${suit}`,
                    suit: suit,
                    value: value,
                    rank: this.valueRanks[value],
                    gamePoints: this.gamePointValues[value]
                };
                this.cards.push(card);
            });
        });
    }

    shuffle(): void {
        this.cards = _.shuffle(this.cards);
    }

    draw(amount: number = 1): Card[] {
        let cards: Card[] = []; 
        _.each(_.range(amount), i => {
            let card = this.cards.pop();
            this.cardsInPlay.push(card);
            cards.push(card);
        })
        return cards
    }

    collect(): void {
        this.cards = this.cards.concat(this.cardsInPlay);
        this.cardsInPlay = [];
    }

    drawSpecificCards(...names: string[]): Card[] | Card {
        let cardsRequested = [];
        _.each(names, name => {
            _.each(this.cards, card => {
                if (card.name === name) {
                    cardsRequested.push(card);
                };
            });
        });
        if (cardsRequested.length > 1) {
            return cardsRequested
        } else {
            return cardsRequested[0]
        }
    }
};