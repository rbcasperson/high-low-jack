import * as _ from 'lodash';

import {Card} from '../engine/src/deck';


export function getCardIDByName(card) {
    let suitLetter = card.suit[0].toLowerCase()
    let value = undefined
    if (!isNaN(card.value)) {
        value = card.value
    } else {
        value = card.value[0].toLowerCase()
    }
    return `${suitLetter}-${value}`
}

function colorOfSuit(suit: string) {
    if (suit == "hearts" || suit == "diamonds") {
        return "red"
    } else if (suit == "spades" || suit == "clubs") {
        return "black"
    }
}

export function sortHand(hand: Card[]): Card[] {
    let cardsBySuit = {}
    _.each(hand, card => {
        if (card.suit in cardsBySuit) {
            cardsBySuit[card.suit].push(card)
        } else {
            cardsBySuit[card.suit] = [card]
        }
    })
    let redSuitCards: Card[][] = []
    let blackSuitCards: Card[][] = []
    _.each(cardsBySuit, (cards, suit) => {
        cards = _.sortBy(cards, card => { return card.rank })
        if (colorOfSuit(suit) == "red") {
            redSuitCards.push(cards)
        } else if (colorOfSuit(suit) == "black") {
            blackSuitCards.push(cards)
        }
    })
    redSuitCards = _.shuffle(redSuitCards)
    blackSuitCards = _.shuffle(blackSuitCards)

    let numberOfRedSuitsWithCards = redSuitCards.length
    let numberOfBlackSuitsWithCards = blackSuitCards.length

    if (numberOfBlackSuitsWithCards == numberOfRedSuitsWithCards) {
        let order = _.shuffle(["red", "black"])
        let allCards: Card[][] = []
        _.each(_.range(numberOfRedSuitsWithCards), i => {
            if (order[0] == "red") {
                allCards.push(redSuitCards[i])
                allCards.push(blackSuitCards[i])
            } else {
                allCards.push(blackSuitCards[i])
                allCards.push(redSuitCards[i])
            }
        })
        return _.flatten(allCards)
    } else if (numberOfBlackSuitsWithCards == 0) {
        return _.flatten(redSuitCards)
    } else if (numberOfRedSuitsWithCards == 0) {
        return _.flatten(blackSuitCards)
    } else {
        if (numberOfRedSuitsWithCards > numberOfBlackSuitsWithCards) {
            return _.flatten([redSuitCards[0], blackSuitCards[0], redSuitCards[1]])
        } else {
            return _.flatten([blackSuitCards[0], redSuitCards[0], blackSuitCards[1]])
        }
    }
}
