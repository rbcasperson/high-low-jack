import * as _ from 'lodash';

import {Match} from '../engine/src/match';
import {isValidBid} from '../engine/src/match/tools';
import {getCardIDByName} from './helpers';
import {SeatingArrangement} from './seatingArrangement';


export class MatchHandler {

    match: Match
    currentDealer: string
    seatingArrangement: SeatingArrangement
    numberOfPlayers: number

    _currentBidder: string
    _numberOfBidsMadeThisRound: number

    constructor(match: Match) {
        this.match = match

        this.currentDealer = _.sample(this.match.players).name
        this.seatingArrangement = new SeatingArrangement(this.match.teams)
        this.numberOfPlayers = this.seatingArrangement.playerOrder.length

        this._currentBidder = undefined
        this._numberOfBidsMadeThisRound = undefined
    }

    start() {
        this.match.deal()
        this.displayCards()
        this.collectBidsManually()
    }

    displayCards() {
        let playersDiv = document.getElementById("players")

        _.each(this.seatingArrangement.playerOrder, playerName => {
            let playerObject = this.match.players[playerName]

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

    collectBidsManually() {
        this._numberOfBidsMadeThisRound = 0
        this._currentBidder = this.seatingArrangement.getPlayerToTheLeftOf(this.currentDealer)
        this.collectBidFrom(this._currentBidder)
    }

    collectBidFrom(playerName: string) {
        let actionDiv = document.getElementById("action")
        
        let h3 = document.createElement("h3")
        h3.appendChild(document.createTextNode(`Bid From ${playerName}:`))
        actionDiv.appendChild(h3)
    
        let validBids = _.filter(_.range(2, this.match.settings.maxBid + 1), bid => {
            return isValidBid(bid, this.match.round.bid, this.match.settings.maxBid)
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
            this.match.makeBid(playerName, parseInt(bidValue))

            this._numberOfBidsMadeThisRound += 1
            this._currentBidder = this.seatingArrangement.getPlayerToTheLeftOf(playerName)
    
            // TODO - make this into a helper function
            while (actionDiv.hasChildNodes()) {
                actionDiv.removeChild(actionDiv.lastChild);
            }

            if (this._numberOfBidsMadeThisRound < this.numberOfPlayers) {
                this.collectBidFrom(this._currentBidder)
            } else {
                this.match.completeBidding()
                let h4 = document.createElement("h4")
                h4.innerHTML = `${this.match.round.bid.playerName} won the bidding with a bid of ${this.match.round.bid.amount}`
                actionDiv.appendChild(h4)
            }
    
        })
        actionDiv.appendChild(makeBidButton)
    }
}