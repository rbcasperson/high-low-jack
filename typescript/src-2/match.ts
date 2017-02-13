import * as _ from "lodash";

import {Deck} from './deck';
import {Team} from "./team";
import {Player} from "./player";

class Match {
    settings;
    deck = new Deck()
    round = {
        number: 1,
        trumpSuit: undefined,
        bid: {
            playerName: undefined,
            amount: 0
        }
    };
    trick = {
        number: 1,
        leadSuit: undefined,
        cardsPlayed: {},
        leadPlayer: undefined
    };
    teams;
    players;

    constructor(settings = undefined) {
        this.settings = settings;
        this._assignTeamsAndPlayers(settings.teams)
    }

    get scores() {
        let scores = {}
        _.each(this.teams, (team, teamName) => {
            scores[teamName] = team.score
        })
        return scores
    }

    _assignTeamsAndPlayers(teamSettings): void {
        _.each(teamSettings, (playerNames, teamName) => {
            this.teams[teamName] = new Team(teamName, playerNames)
            _.each(playerNames, playerName => {
                this.players[playerName] = new Player(playerName, teamName)
            })
        })
    }
}
