import * as _ from "lodash";

import {Card} from "./deck";
import {CardsPlayed, Teams} from "./match";


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

export function getTeamFromPlayer(teams: Teams, playerName: string): string {
    let thisPlayersTeam = undefined;
    _.each(teams, (team, teamName) => {
        if (team.players[playerName]) {
            thisPlayersTeam = teamName
        };
    });
    return thisPlayersTeam
}
