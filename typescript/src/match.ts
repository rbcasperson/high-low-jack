import * as _ from "lodash";

import {Player} from "./player"
import {Team} from "./team"
import {Card} from "./deck"
import * as tools from "./tools"

interface TeamSettings {
    [teamName: string]: string[]
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
    teams: Teams = {}
    players: Players = {}
    round: Round
    trick: Trick

    constructor(teamSettings: TeamSettings) {
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

    completeTrick(): void {
        let winner = tools.determineTrickWinner(this.trick.cardsPlayed, 
                                                this.round.trumpSuit,
                                                this.trick.leadSuit);
        let winningTeam = tools.getTeamFromPlayer(this.teams, winner)
              
    }
}
