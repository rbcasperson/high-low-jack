"use strict";
const ava_1 = require('ava');
const team_1 = require('../src/team');
ava_1.default.beforeEach(`create a new team`, t => {
    let teamName = 'The Knicks';
    let playerNames = ['Kristaps Porziņģis', 'Rajens Kaspersons'];
    t.context.team = new team_1.Team(teamName, playerNames);
});
ava_1.default(`a team starts with a score of zero`, t => {
    t.is(t.context.team.score, 0);
});
ava_1.default(`a team name is assigned`, t => {
    t.is(t.context.team.name, 'The Knicks');
});
ava_1.default(`players are assigned to the team`, t => {
    t.truthy(t.context.team.players);
    t.truthy(t.context.team.players['Kristaps Porziņģis']);
    t.truthy(t.context.team.players['Rajens Kaspersons']);
    t.falsy(t.context.team.players['Alexander Nevsky']);
});
