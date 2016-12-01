import * as _ from "lodash";
import {Card} from "./deck";

export class Player {
    name: string;
    team: string;
    hand: Card[] = [];
    tablePosition: number;
    
    constructor(name: string, teamName: string) {
        this.name = name;
        this.team = teamName;
    }

    removeCard(cardName): Card {
        let playedCard = undefined;
        _.each(this.hand, card => {
            if (card.name === cardName) {
                playedCard = card
            };
        });
        // remove the card from the hand
        this.hand = _.filter(this.hand, card => {
            return card.name !== playedCard.name
        });
        return playedCard
    }
}