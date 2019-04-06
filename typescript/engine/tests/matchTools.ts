import * as _ from 'lodash';
import test from 'ava';

import {getCard} from './match'
import {Match} from '../src/match'
import {determineTrickWinner, isValidCardToPlay, determineHighPointWinner,
        determineLowPointWinner, determineJackPointWinner, determineGamePointWinner,
        determinePointsEarnedForEachTeam} from '../src/match/tools'

// determineTrickWinner tests

test(`the trick winner can be determined - scenario 1`, t => {
    let cardsPlayed = {
        "Player 1": getCard("ace of spades"),
        "Player 2": getCard("2 of spades"),
        "Player 3": getCard("7 of clubs"),
        "Player 4": getCard("10 of spades") 
    };
    let trumpSuit = "spades";
    let leadSuit = "spades";
    let winningPlayerName = determineTrickWinner(cardsPlayed, trumpSuit, leadSuit);
    t.is(winningPlayerName, "Player 1");
});

test(`the trick winner can be determined  - scenario 2`, t => {
    let cardsPlayed = {
        "Player 1": getCard("ace of spades"),
        "Player 2": getCard("2 of spades"),
        "Player 3": getCard("7 of clubs"),
        "Player 4": getCard("10 of spades") 
    };
    let trumpSuit = "clubs";
    let leadSuit = "spades";
    let winningPlayerName = determineTrickWinner(cardsPlayed, trumpSuit, leadSuit);
    t.is(winningPlayerName, "Player 3");
});

test(`the trick winner can be determined  - scenario 3`, t => {
    let cardsPlayed = {
        "Player 1": getCard("2 of spades"),
        "Player 2": getCard("ace of clubs"),
        "Player 3": getCard("ace of diamonds"),
        "Player 4": getCard("king of clubs") 
    };
    let trumpSuit = "hearts";
    let leadSuit = "spades";
    let winningPlayerName = determineTrickWinner(cardsPlayed, trumpSuit, leadSuit);
    t.is(winningPlayerName, "Player 1");
});

test(`the trick winner can be determined  - scenario 4`, t => {
    let cardsPlayed = {
        "Player 1": getCard("2 of diamonds"),
        "Player 2": getCard("10 of diamonds"),
        "Player 3": getCard("ace of diamonds"),
        "Player 4": getCard("king of diamonds") 
    };
    let trumpSuit = "hearts";
    let leadSuit = "diamonds";
    let winningPlayerName = determineTrickWinner(cardsPlayed, trumpSuit, leadSuit);
    t.is(winningPlayerName, "Player 3");
});

// isValidCardToPlay tests

test(`it can be determined if a card is a valid card to play - scenario 1`, t => {
    let cardName = "7 of hearts";
    let hand = [getCard("7 of hearts"), getCard("6 of hearts"), getCard("2 of hearts")];
    let leadSuit = "clubs";
    let trumpSuit = "spades";
    t.true(isValidCardToPlay(cardName, hand, leadSuit, trumpSuit));
});

test(`it can be determined if a card is a valid card to play - scenario 2`, t => {
    let cardName = "7 of hearts";
    let hand = [getCard("7 of hearts"), getCard("6 of hearts"), getCard("2 of clubs")];
    let leadSuit = "clubs";
    let trumpSuit = "spades";
    t.false(isValidCardToPlay(cardName, hand, leadSuit, trumpSuit));
});

test(`it can be determined if a card is a valid card to play - scenario 3`, t => {
    let cardName = "2 of clubs";
    let hand = [getCard("7 of hearts"), getCard("6 of hearts"), getCard("2 of clubs")];
    let leadSuit = "hearts";
    let trumpSuit = "clubs";
    t.true(isValidCardToPlay(cardName, hand, leadSuit, trumpSuit));
});

test(`it can be determined if a card is a valid card to play - scenario 4`, t => {
    let cardName = "7 of hearts";
    let hand = [getCard("7 of hearts"), getCard("6 of hearts"), getCard("2 of clubs")];
    let leadSuit = "clubs";
    let trumpSuit = "clubs";
    t.false(isValidCardToPlay(cardName, hand, leadSuit, trumpSuit));
});

test(`it can be determined if a card is a valid card to play - scenario 5`, t => {
    let cardName = "2 of clubs";
    let hand = [getCard("7 of hearts"), getCard("6 of hearts"), getCard("2 of clubs")];
    let leadSuit = "clubs";
    let trumpSuit = "clubs";
    t.true(isValidCardToPlay(cardName, hand, leadSuit, trumpSuit));
});

// determineHighWinner tests

test(`the winner of the High point can be determined - scenario 1`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("jack of clubs"), getCard("ace of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("jack of clubs"), getCard("ace of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of clubs"), getCard("ace of hearts")];
    teams["Team 2"].trumpCardsWon = [getCard("2 of clubs")];
    t.is(determineHighPointWinner(teams), "Team 1");
});

test(`the winner of the High point can be determined - scenario 2`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of spades"), getCard("ace of hearts")];
    teams["Team 2"].trumpCardsWon = [];
    t.is(determineHighPointWinner(teams), "Team 1");
});

test(`the winner of the High point can be determined - scenario 3`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of hearts")];
    teams["Team 2"].trumpCardsWon = [getCard("jack of clubs")];
    t.is(determineHighPointWinner(teams), "Team 1");
});

// determineLowWinner tests

test(`the winner of the Low point can be determined - scenario 1`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("jack of clubs"), getCard("ace of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("jack of clubs"), getCard("ace of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of clubs"), getCard("ace of hearts")];
    teams["Team 2"].trumpCardsWon = [getCard("2 of clubs")];
    t.is(determineLowPointWinner(teams), "Team 2");
});

test(`the winner of the Low point can be determined - scenario 2`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of spades"), getCard("ace of hearts")];
    teams["Team 2"].trumpCardsWon = [];
    t.is(determineLowPointWinner(teams), "Team 1");
});

test(`the winner of the Low point can be determined - scenario 3`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of hearts")];
    teams["Team 2"].trumpCardsWon = [getCard("jack of clubs")];
    t.is(determineLowPointWinner(teams), "Team 1");
});

// determineJackWinner tests

test(`the winner of the Jack point can be determined - scenario 1`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("jack of clubs"), getCard("ace of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("jack of clubs"), getCard("ace of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of clubs"), getCard("ace of hearts")];
    teams["Team 2"].trumpCardsWon = [getCard("2 of clubs")];
    t.is(determineJackPointWinner(teams), "Team 1");
});

test(`the winner of the Jack point can be determined - scenario 3`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of hearts")];
    teams["Team 2"].trumpCardsWon = [getCard("jack of clubs")];
    t.is(determineJackPointWinner(teams), "Team 2");
});

test(`when there is no Jack of the trump suit, no Jack point winner is determined`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of spades"), getCard("ace of hearts")];
    teams["Team 2"].trumpCardsWon = [];
    t.is(determineJackPointWinner(teams), null);
});

// determineGameWinner tests

test(`the winner of the Game point can be determined - scenario 1`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of hearts")];
    teams["Team 2"].trumpCardsWon = [getCard("jack of clubs")];
    t.is(determineGamePointWinner(teams), "Team 2");
});

test(`the winner of the Game point can be determined - scenario 2`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs"), getCard("10 of spades")];
    teams["Team 1"].trumpCardsWon = [];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of hearts")];
    teams["Team 2"].trumpCardsWon = [];
    t.is(determineGamePointWinner(teams), "Team 1");
});

test(`when there is a tie for Game, no Game point winner is determined`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs"), getCard("jack of spades")];
    teams["Team 1"].trumpCardsWon = [];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of hearts")];
    teams["Team 2"].trumpCardsWon = [];
    t.is(determineGamePointWinner(teams), null);
});

// determinePointsEarned tests

test(`points for each team can be dermined - scenario 1`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of clubs")];
    teams["Team 2"].trumpCardsWon = [getCard("jack of clubs")];
    let pointsEarned = determinePointsEarnedForEachTeam(teams);
    t.deepEqual(pointsEarned["Team 1"], ["high", "low"]);
    t.deepEqual(pointsEarned["Team 2"], ["jack", "game"]);
});

test(`points for each team can be dermined - scenario 2`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of spades"), getCard("ace of hearts")];
    teams["Team 2"].trumpCardsWon = [];
    let pointsEarned = determinePointsEarnedForEachTeam(teams);
    t.deepEqual(pointsEarned["Team 1"], ["high", "low"]);
    t.deepEqual(pointsEarned["Team 2"], ["game"]);
});

test(`points for each team can be dermined - scenario 3`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs"), getCard("jack of spades")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of hearts")];
    teams["Team 2"].trumpCardsWon = [getCard("jack of clubs")];
    let pointsEarned = determinePointsEarnedForEachTeam(teams);
    t.deepEqual(pointsEarned["Team 1"], ["high", "low"]);
    t.deepEqual(pointsEarned["Team 2"], ["jack"]);
});

test(`points for each team can be dermined - scenario 4`, t => {
    let teams = new Match().teams;
    teams["Team 1"].cardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs"), getCard("jack of spades")];
    teams["Team 1"].trumpCardsWon = [getCard("2 of clubs"), getCard("ace of clubs"), getCard("king of clubs")];
    teams["Team 2"].cardsWon = [getCard("2 of hearts"), getCard("ace of hearts"), getCard("king of hearts"), getCard("jack of hearts")];
    teams["Team 2"].trumpCardsWon = [];
    let pointsEarned = determinePointsEarnedForEachTeam(teams);
    t.deepEqual(pointsEarned["Team 1"], ["high", "low"]);
    t.deepEqual(pointsEarned["Team 2"], []);
});
