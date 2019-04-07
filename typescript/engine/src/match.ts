import * as _ from 'lodash';

import {Trick, Scores, Teams} from './types';
import {Deck, Card} from './deck';
import {Team} from './team';
import {Player} from './player';
import {isValidBid, isValidCardToPlay, determineTrickWinner, determinePointsEarnedForEachTeam} from './match/tools'
import {shuffle, draw, removeCard} from './deck/tools'

let defaultSettings = {
    cardsPerPlayer: 6,
    maxBid: 4,
    teams: [
        {
            name: 'Team 1',
            players: [
                'Player 1',
                'Player 2'
            ]
        },
        {
            name: 'Team 2',
            players: [
                'Player 3',
                'Player 4'
            ]
        }
    ]
};

export class Match {
    public settings;
    public deck = new Deck();
    public round = {
        number: 1,
        trumpSuit: undefined,
        bid: {
            playerName: undefined,
            amount: 0
        }
    };
    public trick: Trick = {
        number: 1,
        leadSuit: undefined,
        cardsPlayed: {},
        leadPlayer: undefined
    };
    public teams: Teams = {};
    public players: {
        [playerName: string]: Player;
    } = {};

    public constructor(settings = defaultSettings) {
        this.settings = settings;
        _.each(settings.teams, team => {
            this.teams[team.name] = new Team(team.name, team.players)
            _.each(team.players, playerName => {
                this.players[playerName] = new Player(playerName, team.name)
            });
        });
    }

    public get scores(): Scores {
        let scores: Scores = {}
        _.each(this.teams, (team, teamName) => {
            scores[teamName] = team.score
        });
        return scores
    }

    public deal() {
        this.deck = new Deck()
        this.deck.cards = shuffle(this.deck.cards);
        _.each(this.players, (player, playerName) => {
            [this.deck, player.hand] = draw(this.deck, this.settings.cardsPerPlayer);
        });
    }

    public makeBid(playerName: string, bidAmount: number) {
        if (isValidBid(bidAmount, this.round.bid, this.settings.maxBid)) {
            this.round.bid.amount = bidAmount;
            this.round.bid.playerName = playerName
        };
    }

    public completeBidding() {
        this.trick.leadPlayer = this.round.bid.playerName;
    }

    public playCard(cardName: string, playerName: string) {
        if (isValidCardToPlay(cardName, this.players[playerName].hand, this.trick.leadSuit, this.round.trumpSuit)) {
            let cardBeingPlayed: Card;
            [this.players[playerName].hand, cardBeingPlayed] = removeCard(this.players[playerName].hand, cardName);
            this.trick.cardsPlayed[playerName] = cardBeingPlayed;
            if (!this.trick.leadSuit) {
                this.trick.leadSuit = cardBeingPlayed.suit
                this.trick.leadPlayer = playerName
            };
            if (!this.round.trumpSuit) {
                this.round.trumpSuit = cardBeingPlayed.suit
            };
            return true
        } else {
            return false
        };
    }

    public completeTrick() {
        let winningPlayerName = determineTrickWinner(this.trick.cardsPlayed, this.round.trumpSuit, this.trick.leadSuit);
        let winningTeam = this.players[winningPlayerName].team;

        _.each(this.trick.cardsPlayed, (card, playerName) => {
            this.teams[winningTeam].cardsWon.push(card)
            if (card.suit === this.round.trumpSuit) {
                this.teams[winningTeam].trumpCardsWon.push(card);
            };
        });

        this.trick.cardsPlayed = {};
        if (this.trick.number < this.settings.cardsPerPlayer) {
            this.trick.number += 1;
            this.trick.leadPlayer = winningPlayerName;
            this.trick.leadSuit = undefined;
            return false
        } else {
            this.trick = {
                number: 1,
                leadSuit: undefined,
                cardsPlayed: {},
                leadPlayer: undefined
            }
            return true
        }
    }

    public completeRound() {
        // 1. Determine how many points each team earned
        let pointsEarned = determinePointsEarnedForEachTeam(this.teams);
        // 2. Check if the bidding team made the bid
        let biddingTeamName = this.players[this.round.bid.playerName].team;
        let bidWasNotMade = pointsEarned[biddingTeamName].length < this.round.bid.amount;
        // 3. Update each team's score accordingly
        _.each(pointsEarned, (points, teamName) => {
            if (teamName === biddingTeamName && bidWasNotMade) {
                this.teams[teamName].score -= this.round.bid.amount;
            } else {
                this.teams[teamName].score += pointsEarned[teamName].length;
            };
        });
        // 4. Check if the match is over
        let matchIsOver = false;
        _.each(this.teams, (team, teamName) => {
            if (team.score >= this.settings.winningScore) {
                matchIsOver = true;
            }
        });
        if (matchIsOver) {
            return true
        }
        // 5. If it's not over, reset the round and prepare for a new one.
        this.round = {
            number: this.round.number + 1,
            trumpSuit: undefined,
            bid: {
                playerName: undefined,
                amount: 0
            }
        };
        return false
    }
}
