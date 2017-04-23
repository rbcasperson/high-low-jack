import * as _ from 'lodash';

import {Card} from '../deck'

export let shuffle = _.shuffle

export function draw(deck, amount = 1) {
    let cards = []; 
    _.each(_.range(amount), i => {
        let card = deck.cards.pop();
        deck.cardsInPlay.push(card);
        cards.push(card);
    })
    return [deck, cards]
};

export function collect(deck) {
    deck.cards = deck.cards.concat(deck.cardsInPlay);
    deck.cardsInPlay = [];
    return deck
};

export function removeCard(cards: Card[], cardName): [Card[], Card] {
    let cardToRemove = undefined
    cards = _.filter(cards, card => {
        if (card.name === cardName) {
            cardToRemove = card;
            return false
        }
        return true
    });
    return [cards, cardToRemove]
}

export function hasCardWithSuit(cards: Card[], suit) {
    return _.some(cards, card => {
        return card.suit === suit
    })
}
