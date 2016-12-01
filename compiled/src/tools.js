"use strict";
const _ = require("lodash");
function trumpHasBeenPlayed(cardsPlayed, trumpSuit) {
    return _.some(cardsPlayed, (card, playerName) => {
        return card.suit === trumpSuit;
    });
}
exports.trumpHasBeenPlayed = trumpHasBeenPlayed;
function _determineTrickWinner(cardsPlayed, bestSuit) {
    let winner = undefined;
    _.each(cardsPlayed, (cardPlayed, playerName) => {
        if (cardPlayed.suit === bestSuit) {
            if (!winner || cardsPlayed[winner].rank > cardPlayed.rank) {
                winner = playerName;
            }
            ;
        }
        ;
    });
    return winner;
}
function determineTrickWinner(cardsPlayed, trumpSuit, leadSuit) {
    if (trumpHasBeenPlayed(cardsPlayed, trumpSuit)) {
        return _determineTrickWinner(cardsPlayed, trumpSuit);
    }
    else {
        return _determineTrickWinner(cardsPlayed, leadSuit);
    }
}
exports.determineTrickWinner = determineTrickWinner;
