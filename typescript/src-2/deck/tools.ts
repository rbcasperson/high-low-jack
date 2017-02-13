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
};

export let shuffle = _.shuffle

export function draw(deck, amount = 1) {
    let cards = []; 
    _.each(_.range(amount), i => {
        let card = deck.cards.pop();
        deck.cardsInPlay.push(card);
        cards.push(card);
    })
    return [deck, cards]
};

export function collect(deck) {
    deck.cards = deck.cards.concat(deck.cardsInPlay);
    deck.cardsInPlay = [];
    return deck
};

export function deal(deck, players, cardsPerPlayer){
    _.each(players, (player, playerName) => {
        [deck, player.hand] = draw(cardsPerPlayer);
    });
    return [deck, players]
}

