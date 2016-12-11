import * as _ from 'lodash';
import test from 'ava';

import {Match} from '../src/match';
import {Deck} from '../src/deck';

test.beforeEach(`create a new team`, t => {
    let teamSettings = {
        'The Knicks': ['Kristaps Porziņģis', 'Rajens Kaspersons'],
        'The Celtics': ['Paul Pierce', 'Kevin Garnet']
    };
    t.context.teamSettings = teamSettings;
    t.context.match = new Match(teamSettings);
});

test(`default settings are applied by default`, t => {
    t.is(t.context.match.settings.startingCardsPerPlayer, 6);
    t.is(t.context.match.settings.tricksPerRound, 6);
    t.is(t.context.match.settings.maxBid, 4);
    t.is(t.context.match.settings.winningScore, 11);
});

test(`settings can be customized`, t => {
    let customSettings = {
        startingCardsPerPlayer: 9,
        tricksPerRound: 9,
        maxBid: 5,
        winningScore: 15
    }
    let match = new Match(t.context.teamSettings, customSettings)
    t.is(match.settings.startingCardsPerPlayer, 9);
    t.is(match.settings.tricksPerRound, 9);
    t.is(match.settings.maxBid, 5);
    t.is(match.settings.winningScore, 15);
});

test(`round and trick are initiated correctly`, t => {
    t.is(t.context.match.round.number, 0);
    t.is(t.context.match.trick.number, 0);
    t.deepEqual(t.context.match.trick.cardsPlayed, {});
});

test(`teams are created with player names in each team`, t => {
    t.truthy(t.context.match.teams['The Knicks']);
    t.true(_.includes(t.context.match.teams['The Knicks'].players, 'Rajens Kaspersons'));
    t.truthy(t.context.match.teams['The Celtics']);
    t.true(_.includes(t.context.match.teams['The Celtics'].players, 'Kevin Garnet'));
    t.falsy(t.context.match.teams['Not a team']);
    t.false(_.includes(t.context.match.teams['The Celtics'].players, 'Michael Jordan'));
});

test(`players are created`, t => {
    t.truthy(t.context.match.players['Kristaps Porziņģis']);
    t.is(t.context.match.players['Kristaps Porziņģis'].team, 'The Knicks');
    t.truthy(t.context.match.players['Rajens Kaspersons']);
    t.is(t.context.match.players['Rajens Kaspersons'].team, 'The Knicks');
    t.truthy(t.context.match.players['Paul Pierce']);
    t.is(t.context.match.players['Paul Pierce'].team, 'The Celtics');
    t.truthy(t.context.match.players['Kevin Garnet']);
    t.is(t.context.match.players['Kevin Garnet'].team, 'The Celtics');
});

test(`cards can be dealt to each player`, t => {
    t.context.match.deal();
    _.each(t.context.match.players, (player, playerName) => {
        t.is(player.hand.length, 6);
    });
});

test(`a card can be played by a player`, t => {
    let [fiveDiamonds, sixClubs] = t.context.match.deck.drawSpecificCards('5 of diamonds', '6 of clubs');
    t.context.match.players['Kristaps Porziņģis'].hand = [fiveDiamonds, sixClubs];
    t.context.match.playCard('Kristaps Porziņģis', '5 of diamonds');
    t.deepEqual(t.context.match.players['Kristaps Porziņģis'].hand, [sixClubs]);
    t.deepEqual(t.context.match.trick.cardsPlayed['Kristaps Porziņģis'], fiveDiamonds)

});

test(`a bid can be made by a player`, t => {
    let validBid = t.context.match.makeBid('Rajens Kaspersons', 2);
    t.true(validBid);
    t.deepEqual(t.context.match.round.bid, {
        playerName: 'Rajens Kaspersons',
        amount: 2
    });
    let invalidBid = t.context.match.makeBid('Kristaps Porziņģis', 2);
    t.false(invalidBid);

})

test(`a trick is completed, resetting Match().trick for the next trick`, t => {
    let cardsToDraw = ['ace of spades', 'king of hearts', '2 of clubs', '2 of spades'];
    let [aceSpades, kingHearts, twoClubs, twoSpades] = t.context.match.deck.drawSpecificCards(...cardsToDraw);
    let cardsPlayed = {
        'Kristaps Porziņģis': aceSpades,
        'Paul Pierce': kingHearts,
        'Rajens Kaspersons': twoClubs,
        'Kevin Garnet': twoSpades
    };
    t.context.match.trick.cardsPlayed = cardsPlayed;
    t.context.match.trick.number = 1;
    t.context.match.trick.leadSuit = 'hearts';
    t.context.match.round.trumpSuit = 'spades';
    t.context.match.completeTrick()
    t.is(t.context.match.trick.leadPlayer, 'Kristaps Porziņģis');
    t.is(t.context.match.trick.number, 2);
    t.deepEqual(t.context.match.trick.cardsPlayed, {});
    t.deepEqual(t.context.match.teams['The Knicks'].cardsWon, [aceSpades, kingHearts, twoClubs, twoSpades]);
    t.deepEqual(t.context.match.teams['The Celtics'].cardsWon, []);
    t.deepEqual(t.context.match.teams['The Knicks'].trumpCardsWon, [aceSpades, twoSpades]);
    t.deepEqual(t.context.match.teams['The Celtics'].trumpCardsWon, []);
});
