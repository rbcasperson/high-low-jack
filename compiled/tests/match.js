"use strict";
const ava_1 = require('ava');
const match_1 = require('../src/match');
ava_1.default.beforeEach(`create a new team`, t => {
    let teamSettings = {
        'The Knicks': ['Kristaps Porziņģis', 'Rajens Kaspersons'],
        'The Celtics': ['Paul Pierce', 'Kevin Garnet']
    };
    t.context.match = new match_1.Match(teamSettings);
});
ava_1.default(`teams are created with players in each team`, t => {
    t.truthy(t.context.match.teams['The Knicks']);
    t.truthy(t.context.match.teams['The Knicks'].players['Rajens Kaspersons']);
    t.truthy(t.context.match.teams['The Celtics']);
    t.truthy(t.context.match.teams['The Celtics'].players['Kevin Garnet']);
    t.falsy(t.context.match.teams['Not a team']);
    t.falsy(t.context.match.teams['The Celtics'].players['Michael Jordan']);
});
ava_1.default(`round and trick are initiated correctly`, t => {
    t.is(t.context.match.round.number, 0);
    t.is(t.context.match.trick.number, 0);
    t.deepEqual(t.context.match.trick.cardsPlayed, {});
});
