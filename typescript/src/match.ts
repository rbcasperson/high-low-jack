import * as _ from "lodash";

import {Player} from "./player"
import {Team} from "./team"
import {Deck, Card} from "./deck"
import * as tools from "./tools"

interface TeamSettings {
    [teamName: string]: string[]
}

interface Settings {
    cardsPerRound: number
}

interface scores {
    [teamName: string]: number
}

export interface Teams {
    [teamName: string]: Team
}

interface Players {
    [playerName: string]: Player
}

interface Round {
    number: number,
    trumpSuit: string
}

export interface CardsPlayed {
    [playerName: string]: Card
}

interface Trick {
    number: number,
    leadSuit: string,
    cardsPlayed: CardsPlayed
}

export class Match {
    settings: Settings
    teams: Teams = {}
    players: Players = {}
    deck: Deck
    round: Round
    trick: Trick

    constructor(teamSettings: TeamSettings, settings?: Settings) {
        this.deck = new Deck();
        this.settings = settings || {
            cardsPerRound: 6
        };
        this.setUpTeamsAndPlayers(teamSettings);
        this.round = {
            number: 0,
            trumpSuit: ''
        };
        this.trick = {
            number: 0,
            leadSuit: '',
            cardsPlayed: {}
        };
    }

    get scores(): scores {
        let scores = {}
        _.each(this.teams, (team, teamName) => {
            scores[teamName] = team.score
        })
        return scores
    }

    setUpTeamsAndPlayers(teamSettings: TeamSettings): void {
        _.each(teamSettings, (playerNames, teamName) => {
            this.teams[teamName] = new Team(teamName, playerNames)
            _.each(playerNames, playerName => {
                this.players[playerName] = new Player(playerName, teamName)
            })
        })
    }

    completeTrick(): string | null {
        let winner = tools.determineTrickWinner(this.trick.cardsPlayed, 
                                                this.round.trumpSuit,
                                                this.trick.leadSuit);
        let winningTeam = this.players[winner].team;

        _.each(this.trick.cardsPlayed, card => {
            this.teams[winningTeam].cardsWon.push(card)
        });
        this.trick.cardsPlayed = {};

        if (this.trick.number < this.settings.cardsPerRound ) {
            return winner
        } else {
            return null
        }  
    }
}
