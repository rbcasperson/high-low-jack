import * as _ from 'lodash';
import test from 'ava';

import {Team} from '../src/team';

test.beforeEach(`create a new team`, t => {
    let teamName = 'The Knicks';
    let playerNames = ['Kristaps Porziņģis', 'Rajens Kaspersons'];
    t.context.team = new Team(teamName, playerNames);
});

test(`a team starts with a score of zero`, t => {
    t.is(t.context.team.score, 0);
});

test(`a team name is assigned`, t => {
    t.is(t.context.team.name, 'The Knicks');
});

test(`players are assigned to the team`, t => {
    t.deepEqual(t.context.team.players, ['Kristaps Porziņģis', 'Rajens Kaspersons']);
    t.true(_.includes(t.context.team.players, 'Kristaps Porziņģis'));
    t.true(_.includes(t.context.team.players, 'Rajens Kaspersons'));
    t.false(_.includes(t.context.team.players, 'Alexander Nevsky'));
});