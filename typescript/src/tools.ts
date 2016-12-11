import * as _ from "lodash";

import {Card} from "./deck";
import {Bid, CardsPlayed, Round, Teams} from "./match";


export function trumpHasBeenPlayed(cardsPlayed: CardsPlayed, trumpSuit: string): boolean {
    return _.some(cardsPlayed, (card, playerName) => {
        return card.suit === trumpSuit;
    });
}

function _determineTrickWinner(cardsPlayed: CardsPlayed, winningSuit: string): string {
    let winner = undefined;
    _.each(cardsPlayed, (cardPlayed, playerName) => {
        if (cardPlayed.suit === winningSuit) {
            if (!winner || cardsPlayed[winner].rank > cardPlayed.rank) {
                winner = playerName
            };
        };
    });
    return winner
}

export function determineTrickWinner(cardsPlayed: CardsPlayed, trumpSuit: string, leadSuit: string): string {
    if (trumpHasBeenPlayed(cardsPlayed, trumpSuit)) {
        return _determineTrickWinner(cardsPlayed, trumpSuit)
    } else {
        return _determineTrickWinner(cardsPlayed, leadSuit)
    }
}

export function isValidBid(bid: number, currentBid: Bid, maxBid: number): boolean {
    return bid > 1 && currentBid.amount < bid && bid <= maxBid
}

export function _highWinner(teams: Teams): string {
    let highWinner = undefined
    _.each(teams, (team, teamName) => {
        if (!highWinner && team.trumpCardsWon.length > 0) {
            highWinner = {
                teamName: teamName,
                card: team.trumpCardsWon[0]
            };
        }
        _.each(team.trumpCardsWon, trumpCardWon => {
            if (trumpCardWon.rank < highWinner.card.rank) {
                highWinner.teamName = teamName;
                highWinner.card = trumpCardWon;
            };
        });
    });
    return highWinner.teamName
}

export function _lowWinner(teams: Teams): string {
    let lowWinner = undefined
    _.each(teams, (team, teamName) => {
        if (!lowWinner && team.trumpCardsWon.length > 0) {
            lowWinner = {
                teamName: teamName,
                card: team.trumpCardsWon[0]
            };
        }
        _.each(team.trumpCardsWon, trumpCardWon => {
            if (trumpCardWon.rank > lowWinner.card.rank) {
                lowWinner.teamName = teamName;
                lowWinner.card = trumpCardWon;
            };
        });
    });
    return lowWinner.teamName
}

export function _jackWinner(teams: Teams): string | false {
    let jackWinner: string | false = false
    _.each(teams, (team, teamName) => {
        _.each(team.trumpCardsWon, card => {
            if (card.value === "jack") {
                jackWinner = teamName
            };
        });
    });
    return jackWinner
}

export function _gameWinner(teams: Teams): string | false {
    let gameWinner = undefined;
    let winningGameAmount = 0;
    let currentlyTied = true;
    _.each(teams, (team, teamName) => {
        let teamGameAmount = _.sumBy(team.cardsWon, card => {
            return card.gamePoints
        });
        if (teamGameAmount === winningGameAmount) {
            currentlyTied = true;
        } else if (teamGameAmount > winningGameAmount) {
            currentlyTied = false;
            gameWinner = teamName;
            winningGameAmount = teamGameAmount
        }
    });
    if (currentlyTied) {
        // If there is a tie, no team wins the game point
        return false
    } else {
        return gameWinner
    }
}

interface PointsEarned {
    [teamName: string]: string[]
}

export function determinePointsEarned(teams: Teams): PointsEarned {
    let pointsEarned = {};
    _.each(teams, (team, teamName) => {
        pointsEarned[teamName] = [];
    });

    pointsEarned[_highWinner(teams)].push('high');
    pointsEarned[_lowWinner(teams)].push('low');
    let jackWinner = _jackWinner(teams);
    if (jackWinner) {
        pointsEarned[jackWinner].push('jack');
    }
    let gameWinner = _gameWinner(teams);
    if (gameWinner) {
        pointsEarned[gameWinner].push('game');
    }
    
    return pointsEarned
}