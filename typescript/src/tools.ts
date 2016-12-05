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

function _highWinner(teams: Teams): string {
    let highWinner = undefined
    _.each(teams, (team, teamName) => {
        if (!highWinner && team.trumpCardsWon.length > 0) {
            highWinner = {
                teamName: teamName,
                card: team.trumpCardsWon[0]
            };
        } else {
            _.each(team.trumpCardsWon, trumpCardWon => {
                if (trumpCardWon.rank > highWinner.card.rank) {
                    highWinner.teamName = teamName;
                    highWinner.card = trumpCardWon;
                };
            });
        };
    });
    return highWinner.teamName
}

function _lowWinner(teams: Teams): string {
    
}

function _jackWinner(teams: Teams): string | false {
    return false    
}

function _gameWinner(teams: Teams): string {
    
}

export function determinePointsEarned(teams: Teams) {
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
    pointsEarned[_gameWinner(teams)].push('game');

    return pointsEarned


}