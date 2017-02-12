import * as _ from "lodash";

import {Card} from "../deck"

export function removeCardFromHand(hand: Card[], cardName: string) {
    let playedCard = undefined;
    _.each(hand, card => {
        if (card.name === cardName) {
            playedCard = card
        };
    });
    // remove the card from the hand
    this.hand = _.filter(hand, card => {
        return card.name !== playedCard.name
    });
    return playedCard
}