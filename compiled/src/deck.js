"use strict";
const _ = require("lodash");
exports.SUITS = ["spades", "clubs", "hearts", "diamonds"];
exports.VALUES = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
exports.VALUE_RANKS = {
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
class Deck {
    constructor(valueRanks = exports.VALUE_RANKS, values = exports.VALUES, suits = exports.SUITS) {
        this.cards = [];
        this.cardsInPlay = [];
        this.valueRanks = valueRanks;
        _.each(suits, suit => {
            _.each(values, value => {
                let card = {
                    name: `${value} of ${suit}`,
                    suit: suit,
                    value: value,
                    rank: this.valueRanks[value]
                };
                this.cards.push(card);
            });
        });
    }
    shuffle() {
        this.cards = _.shuffle(this.cards);
    }
    draw(amount = 1) {
        let cards = [];
        _.each(_.range(amount), i => {
            let card = this.cards.pop();
            this.cardsInPlay.push(card);
            cards.push(card);
        });
        return cards;
    }
    collect() {
        this.cards = this.cards.concat(this.cardsInPlay);
        this.cardsInPlay = [];
    }
    drawSpecificCards(...names) {
        let cards = _.filter(this.cards, card => {
            return _.includes(names, card.name);
        });
        let orderedCards = [];
        _.each(names, name => {
            _.each(cards, card => {
                if (card.name === name) {
                    orderedCards.push(card);
                }
                ;
            });
        });
        if (orderedCards.length > 1) {
            return orderedCards;
        }
        else {
            return orderedCards[0];
        }
    }
}
exports.Deck = Deck;
