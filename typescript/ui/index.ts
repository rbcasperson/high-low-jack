import * as _ from 'lodash';

import {Match} from '../engine/src/match';

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

function requestBidFrom(playerName: string) {
    let actionDiv = document.getElementById("action")

    let h3 = document.createElement("h3")
    h3.appendChild(document.createTextNode(`Bid From ${playerName}:`))
    actionDiv.appendChild(h3)

    let validBids = _.filter([2, 3, 4], bid => {

    })

    let select = document.createElement("select")
    _.each(validBids, validBid => {

    })
    select.options.add(new Option(""))
}


let match = new Match(settings)

let tableOrder = ["Player 1", "Player 3", "Player 2", "Player 4"]
let currentDealerIndex = 0 // "Player 1" deals first

match.deal();

displayCards()
 /**
_.each(tableOrder, playerName => {
    requestBidFrom(playerName)
})

match.makeBid("Player 1", 2)
match.completeBidding()
*/
