import * as _ from 'lodash';

export function generateCards(suits, values, valueRanks, gamePointValues) {
    let cards = []
    _.each(suits, suit => {
        _.each(values, value => {
            let card = {
                name: `${value} of ${suit}`,
                suit: suit,
                value: value,
                rank: valueRanks[value],
                gamePoints: gamePointValues[value]
            };
            cards.push(card);
        });
    });
    return cards
}