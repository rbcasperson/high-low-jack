import * as _ from "lodash";
import test from 'ava';

import {Deck, SUITS, VALUES, VALUE_RANKS} from '../src/deck';

test.beforeEach(`create a test deck`, t => {
    t.context.deck = new Deck();
});

test(`a deck has 52 cards`, t => {
    t.is(t.context.deck.cards.length, 52)
});

test(`a deck has 13 cards of each suit`, t => {
    let suitCounts = _.countBy(t.context.deck.cards, 'suit');
    _.each(SUITS, suit => {
        t.is(suitCounts[suit], 13);
    });
});

test(`a deck has 4 cards of each value`, t => {
    let valueCounts = _.countBy(t.context.deck.cards, 'value');
    _.each(VALUES, value => {
        t.is(valueCounts[value], 4);
    });
});

test(`each card has the correct default rank`, t => {
    _.each(t.context.deck.cards, card => {
        t.is(card.rank, VALUE_RANKS[card.value]);
    });
});

test(`ranks can be customized`, t => {
    let customRanks = {
        'queen': 1,
        'king': 2,
        '3': 3,
        'jack': 4,
        '7': 5,
        '9': 6,
        '8': 7,
        'ace': 8,
        '6': 9,
        '5': 10,
        '4': 11,
        '10': 12,
        '2': 13
    };
    let deck = new Deck(customRanks);
    _.each(deck.cards, card => {
        t.is(card.rank, customRanks[card.value]);
    });
});

test(`a deck's first card is named 'ace of spades'`, t => {
    t.is(t.context.deck.cards[0].name, 'ace of spades');
});

test(`a deck's cards are in a different order after shuffling`, t => {
    let cardsBeforeShuffle = t.context.deck.cards;
    t.context.deck.shuffle();
    t.notDeepEqual(cardsBeforeShuffle, t.context.deck.cards)
});

function testDraw(t, hand, amount) {
    t.is(hand.length, amount, 'Cards were not returned and added to the hand');
    t.is(t.context.deck.cards.length, 52 - amount, 'Card was not take out of Deck.cards');
    t.is(t.context.deck.cardsInPlay.length, amount, 'Card was not added to cardsInPlay');
};

test(`one card is drawn by default`, t => {
    let hand = t.context.deck.draw();
    testDraw(t, hand, 1);
});

test(`multiple cards can be drawn at once`, t => {
    let test_amount = 7
    let hand = t.context.deck.draw(test_amount);
    testDraw(t, hand, test_amount);
});

test(`cards can be drawn multiple times into different hands`, t => {
    let hand1 = t.context.deck.draw(6);
    let hand2 = t.context.deck.draw(6);
    t.is(t.context.deck.cards.length, 40);
    t.is(t.context.deck.cardsInPlay.length, 12);
});

test(`cards are collected from the cards in play and returned to the deck`, t => {
    t.context.deck.cards = [1, 2, 3, 4, 5];
    t.context.deck.cardsInPlay = [6, 7];
    t.context.deck.collect();
    t.deepEqual(t.context.deck.cards, [1, 2, 3, 4, 5, 6, 7])
    t.deepEqual(t.context.deck.cardsInPlay, []);
});

test(`cards can be drawn and then collected`, t => {
    let hand = t.context.deck.draw(6);
    t.context.deck.collect();
    t.is(t.context.deck.cards.length, 52);
    t.is(t.context.deck.cardsInPlay.length, 0);
});

test(`a specific card can be drawn`, t => {
    let aceOfSpades = t.context.deck.drawSpecificCards('ace of spades');
    t.is(aceOfSpades.suit, 'spades');
    t.is(aceOfSpades.value, 'ace');
});

test(`multiple specific cards can be drawn`, t => {
    let cardsToDraw = ['ace of spades', 'king of hearts', '2 of clubs', '2 of spades'];
    let [aceSpades, kingHearts, twoClubs, twoSpades] = t.context.deck.drawSpecificCards(...cardsToDraw);
    t.is(aceSpades.suit, 'spades');
    t.is(aceSpades.value, 'ace');
    t.is(kingHearts.suit, 'hearts');
    t.is(kingHearts.value, 'king');
    t.is(twoSpades.suit, 'spades');
    t.is(twoSpades.value, '2');
    t.is(twoClubs.suit, 'clubs');
    t.is(twoClubs.value, '2');
});
