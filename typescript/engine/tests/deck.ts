import * as _ from "lodash";
import test from "ava";

import { Deck } from "../src/deck";
import {
  SUITS,
  VALUES,
  VALUE_RANKS,
  GAME_POINT_VALUES
} from "../src/deck/constants";

test(`a deck has 52 cards`, t => {
  t.is(new Deck().cards.length, 52);
});

test(`a deck has 13 cards of each suit`, t => {
  let suitCounts = _.countBy(new Deck().cards, "suit");
  _.each(SUITS, suit => {
    t.is(suitCounts[suit], 13);
  });
});

test(`a deck has 4 cards of each value`, t => {
  let valueCounts = _.countBy(new Deck().cards, "value");
  _.each(VALUES, value => {
    t.is(valueCounts[value], 4);
  });
});

test(`each card has the correct default rank`, t => {
  _.each(new Deck().cards, card => {
    t.is(card.rank, VALUE_RANKS[card.value]);
  });
});

test(`each card has the correct default game point value`, t => {
  _.each(new Deck().cards, card => {
    t.is(card.gamePoints, GAME_POINT_VALUES[card.value]);
  });
});

test(`ranks can be customized`, t => {
  let customRanks = {
    queen: 1,
    king: 2,
    "3": 3,
    jack: 4,
    "7": 5,
    "9": 6,
    "8": 7,
    ace: 8,
    "6": 9,
    "5": 10,
    "4": 11,
    "10": 12,
    "2": 13
  };
  let deck = new Deck(SUITS, VALUES, customRanks, GAME_POINT_VALUES);
  _.each(deck.cards, card => {
    t.is(card.rank, customRanks[card.value]);
  });
});

test(`a deck's first card is named 'ace of spades'`, t => {
  t.is(new Deck().cards[0].name, "ace of spades");
});
