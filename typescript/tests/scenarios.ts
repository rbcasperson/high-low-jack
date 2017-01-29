import * as _ from 'lodash';
import test from 'ava';

import {Match} from '../src/match';
import {Deck} from '../src/deck';

let deck = new Deck();
let [aceSpades, twoSpades, threeSpades, fourSpades, fiveSpades,
sixSpades, sevenSpades, eightSpades, nineSpades, tenSpades, jackSpades,
queenSpades, kingSpades, aceClubs, twoClubs, threeClubs, fourClubs, fiveClubs,
sixClubs, sevenClubs, eightClubs, nineClubs, tenClubs, jackClubs,
queenClubs, kingClubs, aceHearts, twoHearts, threeHearts, fourHearts, fiveHearts,
sixHearts, sevenHearts, eightHearts, nineHearts, tenHearts, jackHearts,
queenHearts, kingHearts, aceDiamonds, twoDiamonds, threeDiamonds, fourDiamonds, fiveDiamonds,
sixDiamonds, sevenDiamonds, eightDiamonds, nineDiamonds, tenDiamonds, jackDiamonds,
queenDiamonds, kingDiamonds] = new Deck().cards

test(`walk through initial setup and one complete round`, t => {
    /**
     * 1. Teams are set up
     * 2. Cards are dealt
     * 3. Each player makes a bid
     * 4. The player who wins the bid plays a card first
     * 5. Each other player plays a card
     * 6. Finish the trick. If there are still cards left, repeat 3-6 with 
     *    the trick winner going first
     * 7. Finish the round. If a team has won, end the match, otherwise,
     *    go back to step 2.
     * 
     * For this example, the table is set up like so:
     * 
     *                 Rajens Kaspersons (RK)
     *                  +-----------------+
     *                  |                 | 
     * Paul Pierce (PP) |      Table      | Kevin Garnet (KG)
     *                  |                 | 
     *                  +-----------------+
     *                  Kristaps Porziņģis (KP)
     * 
     * Rajens is dealing first.
     */
    let teamSettings = {
        'The Knicks': ['KP', 'RK'],
        'The Celtics': ['PP', 'KG']
    };
    let match = new Match(teamSettings);
    // Manually assign the cards instead of match.deal()
    match.players['KG'].hand = [kingSpades, fiveSpades, kingDiamonds, sevenDiamonds, twoDiamonds, twoClubs];
    match.players['KP'].hand = [tenClubs, fourClubs, threeClubs, aceHearts, queenHearts, fourSpades];
    match.players['PP'].hand = [jackHearts, fourHearts, twoHearts, kingClubs, eightClubs, fourDiamonds];
    match.players['RK'].hand = [aceClubs, sevenClubs, eightHearts, nineSpades, eightSpades, twoSpades];
    // Make the bids
    match.makeBid('KG', 2);
    match.makeBid('KP', 3);
    t.deepEqual(match.round.bid, {playerName: 'KP', amount: 3});
    // Complete the bidding
    match.completeBidding()
    t.is(match.trick.leadPlayer, 'KP')
    // Play the first trick's cards
    match.playCard('KP', 'ace of hearts');
    t.is(match.trick.leadSuit, 'hearts');
    t.is(match.round.trumpSuit, 'hearts');
    match.playCard('PP', '4 of hearts');
    match.playCard('RK', '8 of hearts');
    match.playCard('KG', '2 of clubs');
    
    // Complete the first trick
    match.completeTrick();
    t.is(match.trick.leadPlayer, 'KP');
    _.each(match.players, (player, playerName) => {
        t.is(player.hand.length, 5);
    });
    _.each([aceHearts, fourHearts, eightHearts, twoClubs], card => {
        t.true(_.includes(match.teams['The Knicks'].cardsWon, card))
    });
    _.each([aceHearts, fourHearts, eightHearts], card => {
        t.true(_.includes(match.teams['The Knicks'].trumpCardsWon, card))
    });
    // Play the 2nd trick's cards
    match.playCard('KP', 'queen of hearts');
    t.is(match.trick.leadSuit, 'hearts');
    match.playCard('PP', '2 of hearts');
    match.playCard('RK', '2 of spades');
    match.playCard('KG', '2 of diamonds');
    // Complete the 2nd trick
    match.completeTrick();
    t.is(match.trick.leadPlayer, 'KP');
    _.each(match.players, (player, playerName) => {
        t.is(player.hand.length, 4);
    });
    _.each([queenHearts, twoHearts, twoSpades, twoDiamonds], card => {
        t.true(_.includes(match.teams['The Knicks'].cardsWon, card))
    });
    _.each([queenHearts, twoHearts], card => {
        t.true(_.includes(match.teams['The Knicks'].trumpCardsWon, card))
    });
    // Play the 3rd trick's cards
    match.playCard('KP', '4 of spades');
    t.is(match.trick.leadSuit, 'spades');
    match.playCard('PP', '4 of diamonds');
    match.playCard('RK', '8 of spades');
    match.playCard('KG', 'king of spades');
    // Complete the 3rd trick
    match.completeTrick();
    t.is(match.trick.leadPlayer, 'KG');
    _.each(match.players, (player, playerName) => {
        t.is(player.hand.length, 3);
    });
    _.each([fourSpades, fourDiamonds, eightSpades, kingSpades], card => {
        t.true(_.includes(match.teams['The Celtics'].cardsWon, card))
    });
    // Play the 4th trick's cards
    match.playCard('KG', 'king of diamonds');
    t.is(match.trick.leadSuit, 'diamonds');
    match.playCard('KP', '3 of clubs');
    match.playCard('PP', '8 of clubs');
    match.playCard('RK', '9 of spades');
    // Complete the 4th trick
    match.completeTrick();
    t.is(match.trick.leadPlayer, 'KG');
    _.each(match.players, (player, playerName) => {
        t.is(player.hand.length, 2);
    });
    _.each([kingDiamonds, threeClubs, eightClubs, nineSpades], card => {
        t.true(_.includes(match.teams['The Celtics'].cardsWon, card))
    });
    // Play the 5th trick's cards
    match.playCard('KG', '7 of diamonds');
    t.is(match.trick.leadSuit, 'diamonds');
    match.playCard('KP', '4 of clubs');
    match.playCard('PP', 'king of clubs');
    match.playCard('RK', '7 of clubs');
    // Complete the 5th trick
    match.completeTrick();
    t.is(match.trick.leadPlayer, 'KG');
    _.each(match.players, (player, playerName) => {
        t.is(player.hand.length, 1);
    });
    _.each([sevenDiamonds, fourClubs, kingClubs, sevenClubs], card => {
        t.true(_.includes(match.teams['The Celtics'].cardsWon, card));
    });
    // Play the 6th trick's cards
    match.playCard('KG', '5 of spades');
    t.is(match.trick.leadSuit, 'spades');
    match.playCard('KP', '10 of clubs');
    match.playCard('PP', 'jack of hearts');
    match.playCard('RK', 'ace of clubs');
    // Complete the 6th trick
    match.completeTrick();
    _.each(match.players, (player, playerName) => {
        t.is(player.hand.length, 0);
    });
    _.each([aceClubs, fiveSpades, jackHearts, tenClubs], card => {
        t.true(_.includes(match.teams['The Celtics'].cardsWon, card))
    });
    t.true(_.includes(match.teams['The Celtics'].trumpCardsWon, jackHearts));
    // Complete the first round
    
    match.completeRound();
    // The Knicks did not make their bid of three, and have a score of -3
    t.is(match.teams['The Knicks'].score, -3);
    t.is(match.teams['The Celtics'].score, 2);
});