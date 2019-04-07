export const SUITS = ["spades", "clubs", "hearts", "diamonds"];
export const VALUES = [
  "ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king"
];
// The rankings of each card
export const VALUE_RANKS = {
  ace: 1,
  king: 2,
  queen: 3,
  jack: 4,
  "10": 5,
  "9": 6,
  "8": 7,
  "7": 8,
  "6": 9,
  "5": 10,
  "4": 11,
  "3": 12,
  "2": 13
};
// Game point values
export const GAME_POINT_VALUES = {
  ace: 4,
  king: 3,
  queen: 2,
  jack: 1,
  "10": 10,
  "9": 0,
  "8": 0,
  "7": 0,
  "6": 0,
  "5": 0,
  "4": 0,
  "3": 0,
  "2": 0
};
