import {Deck} from './deck'

class Match {
    settings = null;
    deck = new Deck()
    round = {
        number: 1,
        trumpSuit: undefined,
        bid: {
            playerName: undefined,
            amount: 0
        }
    };
    trick = {
        number: 1,
        leadSuit: undefined,
        cardsPlayed: {},
        leadPlayer: undefined
    };
    teams = undefined
    players = undefined

    constructor(settings = undefined) {
        this.settings = settings;
    }
}
