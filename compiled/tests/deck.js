"use strict";
const _ = require("lodash");
const ava_1 = require('ava');
const deck_1 = require('../src/deck');
ava_1.default.beforeEach(`create a test deck`, t => {
    t.context.deck = new deck_1.Deck();
});
ava_1.default(`a deck has 52 cards`, t => {
    t.is(t.context.deck.cards.length, 52);
});
ava_1.default(`a deck has 13 cards of each suit`, t => {
    let suitCounts = _.countBy(t.context.deck.cards, 'suit');
    _.each(deck_1.SUITS, suit => {
        t.is(suitCounts[suit], 13);
    });
});
ava_1.default(`a deck has 4 cards of each value`, t => {
    let valueCounts = _.countBy(t.context.deck.cards, 'value');
    _.each(deck_1.VALUES, value => {
        t.is(valueCounts[value], 4);
    });
});
ava_1.default(`each card has the correct default rank`, t => {
    _.each(t.context.deck.cards, card => {
        t.is(card.rank, deck_1.VALUE_RANKS[card.value]);
    });
});
ava_1.default(`ranks can be customized`, t => {
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
    let deck = new deck_1.Deck(customRanks);
    _.each(deck.cards, card => {
        t.is(card.rank, customRanks[card.value]);
    });
});
ava_1.default(`a deck's first card is named 'ace of spades'`, t => {
    t.is(t.context.deck.cards[0].name, 'ace of spades');
});
ava_1.default(`a deck's cards are in a different order after shuffling`, t => {
    let cardsBeforeShuffle = t.context.deck.cards;
    t.context.deck.shuffle();
    t.notDeepEqual(cardsBeforeShuffle, t.context.deck.cards);
});
function testDraw(t, hand, amount) {
    t.is(hand.length, amount, 'Cards were not returned and added to the hand');
    t.is(t.context.deck.cards.length, 52 - amount, 'Card was not take out of Deck.cards');
    t.is(t.context.deck.cardsInPlay.length, amount, 'Card was not added to cardsInPlay');
}
;
ava_1.default(`one card is drawn by default`, t => {
    let hand = t.context.deck.draw();
    testDraw(t, hand, 1);
});
ava_1.default(`multiple cards can be drawn at once`, t => {
    let test_amount = 7;
    let hand = t.context.deck.draw(test_amount);
    testDraw(t, hand, test_amount);
});
ava_1.default(`cards can be drawn multiple times into different hands`, t => {
    let hand1 = t.context.deck.draw(6);
    let hand2 = t.context.deck.draw(6);
    t.is(t.context.deck.cards.length, 40);
    t.is(t.context.deck.cardsInPlay.length, 12);
});
ava_1.default(`cards are collected from the cards in play and returned to the deck`, t => {
    t.context.deck.cards = [1, 2, 3, 4, 5];
    t.context.deck.cardsInPlay = [6, 7];
    t.context.deck.collect();
    t.deepEqual(t.context.deck.cards, [1, 2, 3, 4, 5, 6, 7]);
    t.deepEqual(t.context.deck.cardsInPlay, []);
});
ava_1.default(`cards can be drawn and then collected`, t => {
    let hand = t.context.deck.draw(6);
    t.context.deck.collect();
    t.is(t.context.deck.cards.length, 52);
    t.is(t.context.deck.cardsInPlay.length, 0);
});
ava_1.default(`a specific card can be drawn`, t => {
    let aceOfSpades = t.context.deck.drawSpecificCards('ace of spades');
    t.is(aceOfSpades.suit, 'spades');
    t.is(aceOfSpades.value, 'ace');
});
ava_1.default(`multiple specific cards can be drawn`, t => {
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
