import test from 'ava';

import {shuffle, draw, collect} from '../src-2/deck/tools'
import {Deck} from '../src-2/deck'

test(`a deck's cards are in a different order after shuffling`, t => {
    let cardsBeforeShuffle = ['card1', 'card2', 'card3'];
    let cardsAfterShuffle = shuffle(cardsBeforeShuffle)
    t.notDeepEqual(cardsBeforeShuffle, cardsAfterShuffle)
});

test(`one card is drawn by default`, t => {
    let deck = new Deck();
    let hand;
    [deck, hand] = draw(deck);
    t.is(hand.length, 1);
    t.is(deck.cards.length, 51);
    t.is(deck.cardsInPlay.length, 1);
});

test(`multiple cards can be drawn at once`, t => {
    let deck = new Deck();
    let hand;
    [deck, hand] = draw(deck, 7);
    t.is(hand.length, 7);
    t.is(deck.cards.length, 45);
    t.is(deck.cardsInPlay.length, 7);
});

test(`cards can be drawn multiple times into different hands`, t => {
    let deck = new Deck();
    let hand1, hand2;
    [deck, hand1] = draw(deck, 6);
    [deck, hand2] = draw(deck, 6);
    t.is(deck.cards.length, 40);
    t.is(deck.cardsInPlay.length, 12);
});

test(`cards are collected from the cards in play and returned to the deck`, t => {
    let deck = new Deck();
    deck.cards = [1, 2, 3, 4, 5];
    deck.cardsInPlay = [6, 7];
    deck = collect(deck);
    t.deepEqual(deck.cards, [1, 2, 3, 4, 5, 6, 7])
    t.deepEqual(deck.cardsInPlay, []);
});

test(`cards can be drawn and then collected`, t => {
    let deck = new Deck();
    let hand;
    [deck, hand] = draw(deck, 6)
    deck = collect(deck)
    t.is(deck.cards.length, 52);
    t.is(deck.cardsInPlay.length, 0);
});
