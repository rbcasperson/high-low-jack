import * as _ from "lodash";
import test from 'ava';

import {Match} from '../src/match'
import {Deck} from '../src/deck'
import {removeCard} from '../src/deck/tools'


export function getCard(cardName) {
    return _.find(new Deck().cards, card => {
        return card.name === cardName
    });
}


test(`default settings, teams, and players are assigned by default`, t => {
    let match = new Match();
    t.is(match.settings.cardsPerPlayer, 6);
    t.is(match.settings.maxBid, 4);
    _.each(match.teams, (team, teamName) => {
        t.true(_.includes(['Team 1', 'Team 2'], teamName))
    });
    _.each(match.players, (player, playerName) => {
        t.true(_.includes(['Player 1', 'Player 2', 'Player 3', 'Player 4'], playerName))
    });
});

test(`custom settings, teams, and players can be assigned`, t => {
    let customSettings = {
        cardsPerPlayer: 9,
        maxBid: 5,
        teams: [
            {
                name: 'The Celtics',
                players: [
                    'Paul Pierce',
                    'Kevin Garnet'
                ]
            },
            {
                name: 'The Knicks',
                players: [
                    'Rajens Kaspersons',
                    'Kristaps Porzinģis'
                ]
            }
        ]
    };
    let match = new Match(customSettings);
    t.is(match.settings.cardsPerPlayer, 9);
    t.is(match.settings.maxBid, 5);
    _.each(match.teams, (team, teamName) => {
        t.true(_.includes(['The Celtics', 'The Knicks'], teamName))
    });
    _.each(match.players, (player, playerName) => {
        t.true(_.includes(['Paul Pierce', 'Kevin Garnet', 'Rajens Kaspersons', 'Kristaps Porzinģis'], playerName))
    });
});

test(`dealing results in each player being given the correct number of cards`, t => {
    let match = new Match();
    match.deal();
    _.each(match.players, (player, playerName) => {
        t.is(player.hand.length, match.settings.cardsPerPlayer)
    });
});

test(`a valid bid assigns a bid to a match`, t => {
    let match = new Match();
    match.makeBid('Kristaps Porzinģis', 2);
    t.is(match.round.bid.amount, 2);
    t.is(match.round.bid.playerName, 'Kristaps Porzinģis');
});

test(`an invalid bid amount of 1 does not assign a bid to a match`, t => {
    let match = new Match();
    match.makeBid('Kristaps Porzinģis', 1);
    t.is(match.round.bid.amount, 0);
    t.is(match.round.bid.playerName, undefined);
});

test(`an invalid bid amount of 2 when the current bid is 3 does not assign a bid to a match`, t => {
    let match = new Match()
    match.round.bid.amount = 3;
    match.round.bid.playerName = 'Test Player';
    match.makeBid('Kristaps Porzinģis', 2);
    t.is(match.round.bid.amount, 3);
    t.is(match.round.bid.playerName, 'Test Player');
});

test(`completing the bidding process assigns the bid to the current round`, t => {
    let match = new Match();
    match.round.bid.amount = 3;
    match.round.bid.playerName = 'Test Player';
    match.completeBidding();
    t.is(match.trick.leadPlayer, 'Test Player')
});

test(`the suit of the first card played in a round is set to the round's trump suit, and the trick's lead suit`, t => {
    let match = new Match();
    match.players["Player 1"].hand = new Deck().cards
    let result = match.playCard("ace of spades", "Player 1");
    t.true(result);
    t.is(match.round.trumpSuit, "spades");
    t.is(match.trick.leadSuit, "spades");
    t.is(match.trick.leadPlayer, "Player 1");
});

function getMatchWithTrickReadyToBeCompleted(trickNumber = 1) {
    let match = new Match();
    match.trick.number = trickNumber;
    match.trick.leadPlayer = "Player 4";
    match.trick.leadSuit = "spades";
    match.round.trumpSuit = "spades";
    match.trick.cardsPlayed["Player 1"] = getCard("ace of spades");
    match.trick.cardsPlayed["Player 2"] = getCard("2 of spades");
    match.trick.cardsPlayed["Player 3"] = getCard("7 of clubs");
    match.trick.cardsPlayed["Player 4"] = getCard("10 of spades");
    return match
}

test(`completing a trick sets up the next trick, determines the trick winner, and returns that the round is not ready to be completed`, t => {
    let match = getMatchWithTrickReadyToBeCompleted();
    let roundIsComplete = match.completeTrick();
    t.is(match.trick.number, 2);
    t.is(match.trick.leadPlayer, "Player 1");
    t.false(roundIsComplete);
});

test(`completing a trick assigns cards won and trump cards won to the winning team`, t => {
    let match = getMatchWithTrickReadyToBeCompleted();
    let roundIsComplete = match.completeTrick();
    t.is(match.teams["Team 1"].cardsWon.length, 4);
    t.is(match.teams["Team 1"].trumpCardsWon.length, 3);
});

test(`completing the last trick does not set up the next trick and returns that the round is ready to be completed`, t => {
    let match = getMatchWithTrickReadyToBeCompleted(6);
    let roundIsComplete = match.completeTrick();
    t.is(match.trick.number, 6);
    t.is(match.trick.leadPlayer, "Player 4");
    t.true(roundIsComplete);
});
