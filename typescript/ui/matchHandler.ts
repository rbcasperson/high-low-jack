import * as _ from 'lodash';

import {Match} from '../engine/src/match';
import {isValidBid} from '../engine/src/match/tools';
import {getCardIDByName, removeChildrenFromElement, sortHand} from './helpers';
import {SeatingArrangement} from './seatingArrangement';
import {Card} from '../engine/src/deck';
import {CARD_HEIGHT, CARD_WIDTH, SX_VALUES_BY_CARD_VALUE, SY_VALUES_BY_CARD_SUIT} from './constants'


export class MatchHandler {

    match: Match

    currentDealer: string
    seatingArrangement: SeatingArrangement
    numberOfPlayers: number
    tablePositions: {
        [playerName: string]: string
    }

    _currentBidder: string
    _numberOfBidsMadeThisRound: number

    constructor(match: Match) {
        this.match = match

        this.currentDealer = _.sample(this.match.players).name
        this.seatingArrangement = new SeatingArrangement(this.match.teams)
        this.numberOfPlayers = this.seatingArrangement.playerOrder.length

        this.tablePositions = {}
        let positionOrder = ["playerLeft", "playerBottom", "playerRight", "playerTop"]
        _.each(_.zip(this.seatingArrangement.playerOrder, positionOrder), ([playerName, position]) => {
            this.tablePositions[playerName] = position
            let text = playerName;
            if (playerName == this.currentDealer) {
                text += " (Dealer)"
            };
            document.getElementById(position + "Label").appendChild(document.createTextNode(text))
        })

        this._currentBidder = undefined
        this._numberOfBidsMadeThisRound = undefined
    }

    start() {
        this.match.deal()
        this.displayCards()
        this.collectBidsManually()
    }

    clearCards(): void {
        _.each(this.tablePositions, (position, playerName) => {
            removeChildrenFromElement(document.getElementById(position + "Cards"))
        })
    }

    displayCards() {
        this.clearCards()

        _.each(this.seatingArrangement.playerOrder, playerName => {
            let playerObject = this.match.players[playerName]
    
            let cardsDiv = document.getElementById(this.tablePositions[playerName] + "Cards")
            _.each(sortHand(playerObject.hand), card => {
                let canvas = document.createElement("canvas");
                canvas.id = getCardIDByName(card);
                canvas.setAttribute("width", CARD_WIDTH.toString())
                canvas.setAttribute("height", CARD_HEIGHT.toString())
                cardsDiv.appendChild(canvas)
            })
        })

        let cardsImage = document.getElementById("cardsImage");
        if (cardsImage instanceof HTMLImageElement) {
            if (cardsImage.complete) {
                this.drawAllCards()
            } else {
                cardsImage.onload = this.drawAllCards
            }
        }
    }

    drawAllCards() {
        let cardsImage = document.getElementById("cardsImage");
        _.each(document.getElementsByTagName("canvas"), canvas => {
            let context = canvas.getContext('2d');
            let [suitLetter, value] = _.split(canvas.id, "-")
            if (cardsImage instanceof HTMLImageElement) {
                // Determine where the top left corner of the correct card is in the image
                let sX = SX_VALUES_BY_CARD_VALUE[value]
                let sY = SY_VALUES_BY_CARD_SUIT[suitLetter]
                // Use the correct width and height of each card to get the right part of the image
                let sWidth = CARD_WIDTH;
                let sHeight = CARD_HEIGHT;
                // Always place the card in the top left of the canvas
                let dX = 0;
                let dY = 0;
                // Do not adjust the displayed size of the image
                let dWidth = CARD_WIDTH;
                let dHeight = CARD_HEIGHT;

                context.drawImage(cardsImage, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
            } else {
                return document.createTextNode(canvas.id)
            }
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
    
            removeChildrenFromElement(actionDiv)

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