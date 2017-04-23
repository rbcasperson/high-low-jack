import * as _ from "lodash";

import {Card} from "./deck"

export class Player {
    name: string;
    team: string;
    hand: Card[] = [];
    
    constructor(playerName: string, teamName: string) {
        this.name = playerName;
        this.team = teamName;
    }
}