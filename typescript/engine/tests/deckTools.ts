import * as _ from "lodash";
import test from "ava";

import {
  shuffle,
  draw,
  collect,
  removeCard,
  hasCardWithSuit
} from "../src/deck/tools";
import { Deck, Card } from "../src/deck";

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
  let deck = { cards: [], cardsInPlay: [] };
  let sA = new Card("spades", "ace");
  let d7 = new Card("diamonds", "7");
  let cK = new Card("clubs", "king");
  let h10 = new Card("hearts", "10");
  let hJ = new Card("hearts", "jack");
  deck.cards = [sA, d7, cK];
  deck.cardsInPlay = [h10, hJ];
  deck = collect(deck);
  t.deepEqual(deck.cards, [sA, d7, cK, h10, hJ]);
  t.deepEqual(deck.cardsInPlay, []);
});

test(`cards can be drawn and then collected`, t => {
  let deck = new Deck();
  let hand;
  [deck, hand] = draw(deck, 6);
  deck = collect(deck);
  t.is(deck.cards.length, 52);
  t.is(deck.cardsInPlay.length, 0);
});

test(`a card can be removed from an array of cards`, t => {
  let cards = new Deck().cards;
  let cardRemoved;
  [cards, cardRemoved] = removeCard(cards, "7 of diamonds");
  t.truthy(cardRemoved);
  t.is(cardRemoved.name, "7 of diamonds");
  t.is(cards.length, 51);
});

test(`it can be determined that an array of cards contains a card of a specified suit`, t => {
  let cards = new Deck().cards;
  t.true(hasCardWithSuit(cards, "hearts"));
  t.true(hasCardWithSuit(cards, "spades"));
});

test(`it can be determined that an array of cards does not contain a card of a specified suit`, t => {
  let cards = [new Card("diamonds", "2"), new Card("clubs", "2")];
  t.false(hasCardWithSuit(cards, "hearts"));
  t.false(hasCardWithSuit(cards, "spades"));
});
