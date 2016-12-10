import * as _ from "lodash";

import {Player} from "./player"
import {Team} from "./team"
import {Deck, Card} from "./deck"
import * as tools from "./tools"

interface TeamSettings {
    [teamName: string]: string[]
}

interface Settings {
    startingCardsPerPlayer: number,
    tricksPerRound: number,
    maxBid: number
}

interface scores {
    [teamName: string]: number
}

export interface Teams {
    [teamName: string]: Team
}

interface Players {
    [playerName: string]: Player
}

export interface Bid {
    playerName: string,
    amount: number
}

export interface Round {
    number: number,
    trumpSuit: string,
    bid: Bid
}

export interface CardsPlayed {
    [playerName: string]: Card
}

interface Trick {
    number: number,
    leadSuit: string,
    cardsPlayed: CardsPlayed,
    leadPlayer: string
}

export class Match {
    settings: Settings
    teams: Teams = {}
    players: Players = {}
    deck: Deck
    round: Round
    trick: Trick

    constructor(teamSettings: TeamSettings, settings?: Settings) {
        this.deck = new Deck();
        this.settings = settings || {
            startingCardsPerPlayer: 6,
            tricksPerRound: 6,
            maxBid: 4
        };
        this.setUpTeamsAndPlayers(teamSettings);
        this.round = {
            number: 0,
            trumpSuit: '',
            bid: {
                playerName: 'No Bids Yet!',
                amount: 0
            }
        };
        this.trick = {
            number: 0,
            leadSuit: '',
            cardsPlayed: {},
            leadPlayer: ''
        };
    }

    get scores(): scores {
        let scores = {}
        _.each(this.teams, (team, teamName) => {
            scores[teamName] = team.score
        })
        return scores
    }

    setUpTeamsAndPlayers(teamSettings: TeamSettings): void {
        _.each(teamSettings, (playerNames, teamName) => {
            this.teams[teamName] = new Team(teamName, playerNames)
            _.each(playerNames, playerName => {
                this.players[playerName] = new Player(playerName, teamName)
            })
        })
    }

    deal(): void {
        _.each(this.players, (player, playerName) => {
            player.hand = this.deck.draw(this.settings.startingCardsPerPlayer);
        });
    }

    makeBid(playerName: string, bid: number): boolean {
        if (tools.isValidBid(bid, this.round.bid, this.settings.maxBid)) {
            this.round.bid = {
                playerName: playerName,
                amount: bid
            }
            return true
        } else {
            console.log(`Bid of ${bid} from ${playerName} is not valid.`);
            return false
        };

    }

    playCard(playerName: string, cardName: string): void {
        let cardBeingPlayed = this.players[playerName].removeCard(cardName);
        this.trick.cardsPlayed[playerName] = cardBeingPlayed;
    }

    completeTrick(): void {
        let winner = tools.determineTrickWinner(this.trick.cardsPlayed, 
                                                this.round.trumpSuit,
                                                this.trick.leadSuit);
        let winningTeam = this.players[winner].team;

        _.each(this.trick.cardsPlayed, (card, playerName) => {
            this.teams[winningTeam].cardsWon.push(card)
            if (card.suit === this.round.trumpSuit) {
                this.teams[winningTeam].trumpCardsWon.push(card);
            };
        });
        this.trick.cardsPlayed = {};

        if (this.trick.number < this.settings.tricksPerRound) {
            this.trick.number += 1;
            this.trick.leadPlayer = winner;
        } else {
            // Not sure yet if I want this to happen automatically. It'd be convenient.
            //this.completeRound()
        };
    }

    completeRound(): void {
        // 1. Determine how many points each team earned
        let pointsEarned = tools.determinePointsEarned(this.teams);
        // 2. Check if the bidding team made the bid
        // 3. Update each team's score accordingly
        // 4. Check if the match is over
        // 5. If it's not over, reset the round and prepare for a new one.
    }
}
