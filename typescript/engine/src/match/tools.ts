import * as _ from "lodash";

import {CardsByPlayer, Bid, Teams, PointsEarned} from "../types";
import {Team} from "../team";
import {Player} from "../player";
import {Card} from "../deck";
import {hasCardWithSuit} from "../deck/tools";


export function isValidBid(bidAmount: number, currentBid: Bid, maxBid: number): boolean {
    return bidAmount > 1 && currentBid.amount < bidAmount && bidAmount <= maxBid
}

// separate the parameters into specific things like hasTrump, hasLeadSuit , etc.
export function isValidCardToPlay(cardName: string, hand: Card[], leadSuit: string, trumpSuit: string): boolean {
    // If there is no lead suit yet, the card is trump, or the card follows the lead suit, it is valid
    if (!leadSuit || _.endsWith(cardName, trumpSuit) || _.endsWith(cardName, leadSuit)) {
        return true
    };
    // If the player has a card of the lead suit, they must follow suit
    return !hasCardWithSuit(hand, leadSuit);
}

function _determineTrickWinner(cardsPlayed: CardsByPlayer, winningSuit: string): string {
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

export function determineTrickWinner(cardsPlayed: CardsByPlayer, trumpSuit: string, leadSuit: string): string {
    if (hasCardWithSuit(_.values(cardsPlayed), trumpSuit)) {
        return _determineTrickWinner(cardsPlayed, trumpSuit)
    } else {
        return _determineTrickWinner(cardsPlayed, leadSuit)
    }
}

export function determineHighPointWinner(teams: Teams): string {
    let highWinnerInfo = null
    _.each(teams, (team, teamName) => {
        _.each(team.trumpCardsWon, trumpCardWon => {
            if (!highWinnerInfo || trumpCardWon.rank < highWinnerInfo.card.rank) {
                highWinnerInfo = {
                    teamName: teamName,
                    card: trumpCardWon
                };
            };
        });
    });
    return highWinnerInfo.teamName
}

export function determineLowPointWinner(teams: Teams): string {
    let lowWinnerInfo = null
    _.each(teams, (team, teamName) => {
        _.each(team.trumpCardsWon, trumpCardWon => {
            if (!lowWinnerInfo || trumpCardWon.rank > lowWinnerInfo.card.rank) {
                lowWinnerInfo = {
                    teamName: teamName,
                    card: trumpCardWon
                };
            };
        });
    });
    return lowWinnerInfo.teamName
}

export function determineJackPointWinner(teams: Teams): string | null {
    let jackWinner = null;
    _.each(teams, (team, teamName) => {
        _.each(team.trumpCardsWon, card => {
            if (card.value === "jack") {
                jackWinner = teamName
            };
        });
    });
    return jackWinner
}

export function determineGamePointWinner(teams: Teams): string | null {
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
        return null
    } else {
        return gameWinner
    }
}

export function determinePointsEarnedForEachTeam(teams: Teams): PointsEarned {
    let pointsEarned: PointsEarned = {};
    _.each(teams, (team, teamName) => {
        pointsEarned[teamName] = [];
    });

    pointsEarned[determineHighPointWinner(teams)].push('high');
    pointsEarned[determineLowPointWinner(teams)].push('low');
    let jackWinner = determineJackPointWinner(teams);
    if (jackWinner) {
        pointsEarned[jackWinner].push('jack');
    }
    let gameWinner = determineGamePointWinner(teams);
    if (gameWinner) {
        pointsEarned[gameWinner].push('game');
    }
    
    return pointsEarned
}