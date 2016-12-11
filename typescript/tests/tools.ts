import * as _ from 'lodash';
import test from 'ava';

import * as tools from '../src/tools';
import {Deck} from '../src/deck';
import {Match} from '../src/match';

test.beforeEach(`initiate a deck`, t => {
    t.context.deck = new Deck();

    let teamSettings = {
        'The Knicks': ['Kristaps Porziņģis', 'Rajens Kaspersons'],
        'The Celtics': ['Paul Pierce', 'Kevin Garnet']
    };
    t.context.match = new Match(teamSettings);

    let cardsToDraw = ['ace of spades', 'king of hearts', '2 of clubs', '2 of spades'];
    let knicksCards = t.context.deck.drawSpecificCards(...cardsToDraw);
    let moreCardsToDraw = ['queen of clubs', '10 of clubs', '4 of diamonds', 'jack of spades'];
    let celticsCards = t.context.deck.drawSpecificCards(...moreCardsToDraw);

    t.context.match.teams['The Knicks'].cardsWon = knicksCards
    t.context.match.teams['The Knicks'].trumpCardsWon = [knicksCards[0], knicksCards[3]]
    t.context.match.teams['The Celtics'].cardsWon = celticsCards
    t.context.match.teams['The Celtics'].trumpCardsWon = [celticsCards[3]]
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

test(`a bid can be determined valid or not valid`, t => {
    let maxBid = 4;
    let currentBid = {
        playerName: 'Bob',
        amount: 3
    };
    t.true(tools.isValidBid(4, currentBid, maxBid));
    t.false(tools.isValidBid(3, currentBid, maxBid));
    // A bid of 1 cannot be made
    t.false(tools.isValidBid(1, undefined, maxBid));
    // Test a max bid higher than 4
    t.true(tools.isValidBid(5, currentBid, 5));
});

test(`a card can be determined valid to play or not valid`, t => {
    let cardsToDraw = ['ace of spades', 'king of hearts', '2 of clubs', '2 of spades'];
    let hand = t.context.deck.drawSpecificCards(...cardsToDraw);
    let leadSuit = 'clubs'
    let trumpSuit = 'diamonds'

    t.true(tools.isValidCardToPlay('2 of clubs', hand, leadSuit, trumpSuit));
    t.false(tools.isValidCardToPlay('king of hearts', hand, leadSuit, trumpSuit));
});

test(`the high winner can be determined`, t => {
    let highWinner = tools._highWinner(t.context.match.teams);
    t.is(highWinner, 'The Knicks');
});

test(`the low winner can be determined`, t => {
    let lowWinner = tools._lowWinner(t.context.match.teams);
    t.is(lowWinner, 'The Knicks');
});

test(`the jack winner can be determined`, t => {
    let jackWinner = tools._jackWinner(t.context.match.teams);
    t.is(jackWinner, 'The Celtics');
});

test(`the game winner can be determined`, t => {
    let gameWinner = tools._gameWinner(t.context.match.teams);
    t.is(gameWinner, 'The Celtics');
});

test(`points earned can be determined`, t => {
    let pointsEarned = tools.determinePointsEarned(t.context.match.teams);
    let expectedPointsEarned = {
        'The Knicks': ['high', 'low'],
        'The Celtics': ['jack', 'game']
    };
    t.deepEqual(pointsEarned, expectedPointsEarned);
});
