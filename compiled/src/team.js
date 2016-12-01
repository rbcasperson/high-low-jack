"use strict";
const _ = require("lodash");
const player_1 = require("./player");
class Team {
    constructor(teamName, playerNames) {
        this.players = {};
        this.cardsWon = [];
        this.name = teamName;
        this.score = 0;
        this.setUpPlayers(playerNames);
    }
    setUpPlayers(playerNames) {
        _.each(playerNames, playerName => {
            this.players[playerName] = new player_1.Player(playerName, this.name);
        });
    }
}
exports.Team = Team;
