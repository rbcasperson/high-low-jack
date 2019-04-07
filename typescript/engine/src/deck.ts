import * as _ from "lodash";

import {
  SUITS,
  VALUES,
  VALUE_RANKS,
  GAME_POINT_VALUES
} from "./deck/constants";

export class Card {
  public name: string;
  public suit: string;
  public value: string;
  public rank: number;
  public gamePoints: number;

  public constructor(
    suit: string,
    value: string,
    rank: number = undefined,
    gamePoints: number = undefined
  ) {
    this.name = `${value} of ${suit}`;
    this.suit = suit;
    this.value = value;
    this.rank = rank;
    this.gamePoints = gamePoints;
  }
}

export class Deck {
  public cards: Card[] = [];
  public cardsInPlay: Card[] = [];

  public constructor(
    suits = SUITS,
    values = VALUES,
    valueRanks = VALUE_RANKS,
    gamePointValues = GAME_POINT_VALUES
  ) {
    _.each(suits, suit => {
      _.each(values, value => {
        this.cards.push(
          new Card(suit, value, valueRanks[value], gamePointValues[value])
        );
      });
    });
  }
}
