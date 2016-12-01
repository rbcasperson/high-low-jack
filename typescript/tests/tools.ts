import * as _ from 'lodash';
import test from 'ava';

import * as tools from '../src/tools';
import {Deck} from '../src/deck';

test.beforeEach(`initiate a deck`, t => {
    t.context.deck = new Deck();
});

test(`whether or not trump has been played can be determined`, t => {
    let cardsToDraw = ['ace of spades', 'king of hearts', '2 of clubs', '2 of spades'];
    let suitPlayed = 'spades';
    let suitNotPlayed = 'diamonds';
    let [aceSpades, kingHearts, twoClubs, twoSpades] = t.context.deck.drawSpecificCards(...cardsToDraw);
    let cardsPlayed = {
        'Player 1': aceSpades,
        'Player 2': kingHearts,
        'Player 3': twoClubs,
        'Player 4': twoSpades
    };
    t.true(tools.trumpHasBeenPlayed(cardsPlayed, suitPlayed));
    t.false(tools.trumpHasBeenPlayed(cardsPlayed, suitNotPlayed));
});
 
test(`trick winner can be determined`, t => {
    let cardsToDraw = ['ace of spades', 'king of hearts', '2 of clubs', '2 of spades'];
    let [aceSpades, kingHearts, twoClubs, twoSpades] = t.context.deck.drawSpecificCards(...cardsToDraw);
    let cardsPlayed = {
        'Player 1': aceSpades,
        'Player 2': kingHearts,
        'Player 3': twoClubs,
        'Player 4': twoSpades
    };
    let trumpSuitPlayed = 'spades';
    let trumpSuitNotPlayed = 'diamonds';
    let leadSuit = 'hearts';
    let winnerTrump = tools.determineTrickWinner(cardsPlayed, trumpSuitPlayed, leadSuit);
    let winnerNoTrump = tools.determineTrickWinner(cardsPlayed, trumpSuitNotPlayed, leadSuit);
    t.is(winnerTrump, 'Player 1');
    t.is(winnerNoTrump, 'Player 2');
});

test(`team name can be determined from player name`, t => {
    let teams = {

    }
    //let teamName = tools.getTeamFromPlayer(teams, playerName)
});