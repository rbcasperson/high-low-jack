import * as _ from "lodash";
import {Player} from "./player"
import {Card} from "./deck"

export class Team {
    score: number
    players: string[]
    cardsWon: Card[]
    trumpCardsWon: Card[]
    name: string

    constructor(teamName: string, playerNames: string[]) {
        this.name = teamName;
        this.players = playerNames;
        this.score = 0;
        this.cardsWon = [];
        this.trumpCardsWon = [];
    }
}