import * as _ from 'lodash';

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
