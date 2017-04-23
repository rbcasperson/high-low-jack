import * as _ from "lodash";

import {Card} from "./deck"

export class Team {
    score: number = 0
    players: string[]
    cardsWon: Card[] = []
    trumpCardsWon: Card[] = []
    name: string

    constructor(teamName: string, playerNames: string[]) {
        this.name = teamName;
        this.players = playerNames;
    }
}