import * as _ from 'lodash';

import {Match} from '../engine/src/match';
import {isValidBid} from '../engine/src/match/tools'

import {getCardIDByName} from './helpers'


let settings = {
    cardsPerPlayer: 6,
    maxBid: 4,
    teams: [
        {
            name: "Team A",
            players: ["Player 1", "Player 2"]
        },
        {
            name:"Team B",
            players: ["Player 3", "Player 4"]
        }
    ]
}

let match = new Match(settings)

function displayCards() {
    let playersDiv = document.getElementById("players")
    console.log(playersDiv.textContent)
    _.each(match.players, (playerObject, playerName) => {
        let playerDiv = document.createElement("div")

        let h3 = document.createElement("h3")
        let playerNameText = document.createTextNode(playerName)
        h3.appendChild(playerNameText)
        playerDiv.appendChild(h3)

        let cardsDiv = document.createElement("div")
        _.each(playerObject.hand, card => {
            let cardDiv = document.createElement("div")
            cardDiv.appendChild(document.createTextNode(card.name))
            cardDiv.setAttribute("id", getCardIDByName(card))
            cardsDiv.appendChild(cardDiv)
        })
        playerDiv.appendChild(cardsDiv)

        playersDiv.appendChild(playerDiv)
    })
}

let tableOrder = ["Player 1", "Player 3", "Player 2", "Player 4"]
let currentDealerIndex = 0 // "Player 1" deals first
let currentBidderIndex = 1
let bids = []

function requestBidFrom(playerName: string, match: Match) {
    let actionDiv = document.getElementById("action")

    let h3 = document.createElement("h3")
    h3.appendChild(document.createTextNode(`Bid From ${playerName}:`))
    actionDiv.appendChild(h3)

    let validBids = _.filter([2, 3, 4], bid => {
        return isValidBid(bid, match.round.bid, match.settings.maxBid)
    })

    let select = document.createElement("select")
    select.id = "bidOptions"
    select.options.add(new Option("pass", "pass", true, true))
    _.each(validBids, validBid => {
        let bid = validBid.toString()
        select.options.add(new Option(bid, bid))
    })
    actionDiv.appendChild(select)

    let makeBidButton = document.createElement("button")
    makeBidButton.innerHTML = "Make Bid"
    makeBidButton.addEventListener("click", () => {
        let bidValue = select.options[select.selectedIndex].value;
        console.log(bidValue)
        bids.push(bidValue)
        currentBidderIndex += 1
        if (currentBidderIndex == tableOrder.length) {
            currentBidderIndex = 0
        }
        match.makeBid(playerName, parseInt(bidValue))


        while (actionDiv.hasChildNodes()) {
            actionDiv.removeChild(actionDiv.lastChild);
        }
        console.log(bids.length)
        if (bids.length < tableOrder.length) {
            requestBidFrom(tableOrder[currentBidderIndex], match)
        } else {
            match.completeBidding()
            let h4 = document.createElement("h4")
            h4.innerHTML = `${match.round.bid.playerName} won the bidding with a bid of ${match.round.bid.amount}`
            actionDiv.appendChild(h4)
        }

    })
    actionDiv.appendChild(makeBidButton)

}

match.deal();

displayCards()

requestBidFrom(tableOrder[currentBidderIndex], match)
