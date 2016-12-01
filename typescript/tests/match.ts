import * as _ from 'lodash';
import test from 'ava';

import {Match} from '../src/match';
import {Deck} from '../src/deck';

test.beforeEach(`create a new team`, t => {
    t.context.deck = new Deck();
    let teamSettings = {
        'The Knicks': ['Kristaps Porziņģis', 'Rajens Kaspersons'],
        'The Celtics': ['Paul Pierce', 'Kevin Garnet']
    };
    t.context.teamSettings = teamSettings;
    t.context.match = new Match(teamSettings);
});

test(`teams are created with players in each team`, t => {
    t.truthy(t.context.match.teams['The Knicks']);
    t.true(_.includes(t.context.match.teams['The Knicks'].players, 'Rajens Kaspersons'));
    t.truthy(t.context.match.teams['The Celtics']);
    t.true(_.includes(t.context.match.teams['The Celtics'].players, 'Kevin Garnet'));
    t.falsy(t.context.match.teams['Not a team']);
    t.false(_.includes(t.context.match.teams['The Celtics'].players, 'Michael Jordan'));
});

test(`default settings are applied by default`, t => {
    t.is(t.context.match.settings.cardsPerRound, 6);
});

test(`settings can be customized`, t => {
    let customSettings = {
        cardsPerRound: 9
    }
    let match = new Match(t.context.teamSettings, customSettings)
    t.is(match.settings.cardsPerRound, 9);
});

test(`round and trick are initiated correctly`, t => {
    t.is(t.context.match.round.number, 0);
    t.is(t.context.match.trick.number, 0);
    t.deepEqual(t.context.match.trick.cardsPlayed, {});
});

test(`trick is completed and the winning player is returned`, t => {
    let cardsToDraw = ['ace of spades', 'king of hearts', '2 of clubs', '2 of spades'];
    let [aceSpades, kingHearts, twoClubs, twoSpades] = t.context.deck.drawSpecificCards(...cardsToDraw);
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
    let winner = t.context.match.completeTrick()
    t.is(winner, 'Kristaps Porziņģis');
    t.deepEqual(t.context.match.trick.cardsPlayed, {});
    t.deepEqual(t.context.match.teams['The Knicks'].cardsWon, [aceSpades, kingHearts, twoClubs, twoSpades]);
    t.deepEqual(t.context.match.teams['The Celtics'].cardsWon, []);
});
