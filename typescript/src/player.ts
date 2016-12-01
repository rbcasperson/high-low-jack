import * as _ from "lodash";
import {Card} from "./deck";

export class Player {
    name: string
    team: string
    tablePosition: number
    
    constructor(name: string, teamName: string) {
        this.name = name;
        this.team = teamName;
    }
}