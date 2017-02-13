import * as _ from "lodash";

import {Team} from "../team"
import {Player} from "../player"
import {Card} from "../deck"

/**
 * Given a hand and a card name, remove that card from the hand, returning both the
 * card and the new hand less of that card. 
 */
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

function _isValidBid(bid: number, currentBid, maxBid: number): boolean {
    return bid > 1 && currentBid.amount < bid && bid <= maxBid
}

export function makeBid(match, bid, currentBid) {
    if (_isValidBid(bid, currentBid, match.settings.maxBid)) {
        match.bid = bid;
    };
    return match
}

