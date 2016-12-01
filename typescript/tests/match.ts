import * as _ from 'lodash';
import test from 'ava';

import {Match} from '../src/match';
import {Deck} from '../src/deck';

test.beforeEach(`create a new team`, t => {
    let teamSettings = {
        'The Knicks': ['Kristaps Porziņģis', 'Rajens Kaspersons'],
        'The Celtics': ['Paul Pierce', 'Kevin Garnet']
    };
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

test(`round and trick are initiated correctly`, t => {
    t.is(t.context.match.round.number, 0);
    t.is(t.context.match.trick.number, 0);
    t.deepEqual(t.context.match.trick.cardsPlayed, {});
});
