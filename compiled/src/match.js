"use strict";
const _ = require("lodash");
const team_1 = require("./team");
const tools = require("./tools");
class Match {
    constructor(teamSettings) {
        this.teams = {};
        this.setUpTeams(teamSettings);
        this.round = {
            number: 0,
            trumpSuit: ''
        };
        this.trick = {
            number: 0,
            leadSuit: '',
            cardsPlayed: {}
        };
    }
    get scores() {
        let scores = {};
        _.each(this.teams, (team, teamName) => {
            scores[teamName] = team.score;
        });
        return scores;
    }
    setUpTeams(teamSettings) {
        _.each(teamSettings, (playerNames, teamName) => {
            this.teams[teamName] = new team_1.Team(teamName, playerNames);
        });
    }
    completeTrick() {
        let winner = tools.determineTrickWinner(this.trick.cardsPlayed, this.round.trumpSuit, this.trick.leadSuit);
    }
}
exports.Match = Match;
