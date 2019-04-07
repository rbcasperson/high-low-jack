import * as _ from "lodash";

import { Match } from "../engine/src/match";
import { isValidBid } from "../engine/src/match/tools";
import {
  getCardIDByName,
  getCardNameByID,
  removeChildrenFromElement,
  sortHand
} from "./helpers";
import { SeatingArrangement } from "./seatingArrangement";
import { Card } from "../engine/src/deck";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  SX_VALUES_BY_CARD_VALUE,
  SY_VALUES_BY_CARD_SUIT
} from "./constants";

export class MatchHandler {
  public match: Match;

  public currentDealer: string;
  public seatingArrangement: SeatingArrangement;
  public numberOfPlayers: number;
  public tablePositions: {
    [playerName: string]: string;
  };

  private _currentBidder: string;
  private _numberOfBidsMadeThisRound: number;

  public constructor(match: Match) {
    this.match = match;

    this.currentDealer = _.sample(this.match.players).name;
    this.seatingArrangement = new SeatingArrangement(this.match.teams);
    this.numberOfPlayers = this.seatingArrangement.playerOrder.length;

    this.tablePositions = {};
    let positionOrder = [
      "playerLeft",
      "playerBottom",
      "playerRight",
      "playerTop"
    ];
    _.each(
      _.zip(this.seatingArrangement.playerOrder, positionOrder),
      ([playerName, position]) => {
        this.tablePositions[playerName] = position;
      }
    );

    this._currentBidder = undefined;
    this._numberOfBidsMadeThisRound = undefined;
  }

  public displayPlayers() {
    _.each(this.tablePositions, (position, playerName) => {
      let text = playerName;
      if (playerName == this.currentDealer) {
        text += " (Dealer)";
      }
      document.getElementById(position + "Label").innerHTML = text;
    });
  }

  public startRound() {
    this.match.deal();
    _.each(this.match.players, player => {
      player.hand = sortHand(player.hand);
    });
    this.displayScores();
    this.displayPlayers();
    this.displayCards();
    this.collectBidsManually();
  }

  public clearCards() {
    _.each(this.tablePositions, (position, playerName) => {
      removeChildrenFromElement(document.getElementById(position + "Cards"));
      removeChildrenFromElement(
        document.getElementById(position + "PlayedCard")
      );
    });
  }

  public displayScores() {
    document.getElementById("scores").innerHTML = `Team A: ${
      this.match.teams["Team A"].score
    } - Team B: ${this.match.teams["Team B"].score}`;
  }

  public displayCards() {
    this.clearCards();

    _.each(this.seatingArrangement.playerOrder, playerName => {
      let playerObject = this.match.players[playerName];

      let cardsDiv = document.getElementById(
        this.tablePositions[playerName] + "Cards"
      );
      _.each(playerObject.hand, card => {
        let canvas = document.createElement("canvas");
        canvas.id = getCardIDByName(card);
        canvas.setAttribute("width", CARD_WIDTH.toString());
        canvas.setAttribute("height", CARD_HEIGHT.toString());
        cardsDiv.appendChild(canvas);
      });
    });

    _.each(this.match.trick.cardsPlayed, (card, playerName) => {
      let placeForCardOnTableDiv = document.getElementById(
        this.tablePositions[playerName] + "PlayedCard"
      );
      removeChildrenFromElement(placeForCardOnTableDiv);
      let canvas = document.createElement("canvas");
      canvas.id = getCardIDByName(card);
      canvas.setAttribute("width", CARD_WIDTH.toString());
      canvas.setAttribute("height", CARD_HEIGHT.toString());
      placeForCardOnTableDiv.appendChild(canvas);
    });

    let cardsImage = document.getElementById("cardsImage");
    if (cardsImage instanceof HTMLImageElement) {
      if (cardsImage.complete) {
        this.drawAllCards();
      } else {
        cardsImage.onload = this.drawAllCards;
      }
    }
  }

  public drawAllCards() {
    let cardsImage = document.getElementById("cardsImage");
    _.each(document.getElementsByTagName("canvas"), canvas => {
      let context = canvas.getContext("2d");
      let [suitLetter, value] = _.split(canvas.id, "-");
      if (cardsImage instanceof HTMLImageElement) {
        // Determine where the top left corner of the correct card is in the image
        let sX = SX_VALUES_BY_CARD_VALUE[value];
        let sY = SY_VALUES_BY_CARD_SUIT[suitLetter];
        // Use the correct width and height of each card to get the right part of the image
        let sWidth = CARD_WIDTH;
        let sHeight = CARD_HEIGHT;
        // Always place the card in the top left of the canvas
        let dX = 0;
        let dY = 0;
        // Do not adjust the displayed size of the image
        let dWidth = CARD_WIDTH;
        let dHeight = CARD_HEIGHT;

        context.drawImage(
          cardsImage,
          sX,
          sY,
          sWidth,
          sHeight,
          dX,
          dY,
          dWidth,
          dHeight
        );
      } else {
        return document.createTextNode(canvas.id);
      }
    });
  }

  public collectBidsManually() {
    this._numberOfBidsMadeThisRound = 0;
    this._currentBidder = this.seatingArrangement.getPlayerToTheLeftOf(
      this.currentDealer
    );
    this.collectBidFrom(this._currentBidder);
  }

  public clearActionDiv() {
    removeChildrenFromElement(document.getElementById("action"));
  }

  public addTextToActionDiv(text: string) {
    let actionDiv = document.getElementById("action");
    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(text));
    actionDiv.appendChild(h3);
  }

  public addElementToActionDiv(element) {
    document.getElementById("action").appendChild(element);
  }

  public collectBidFrom(playerName: string) {
    this.clearActionDiv();
    this.addTextToActionDiv(`Bid From ${playerName}:`);

    let select = document.createElement("select");
    select.id = "bidOptions";

    let validBids;
    // If everyone passed, force the dealer to take a 2 bid
    if (playerName == this.currentDealer && !this.match.round.bid.playerName) {
      validBids = [2];
    } else {
      validBids = _.filter(_.range(2, this.match.settings.maxBid + 1), bid => {
        return isValidBid(
          bid,
          this.match.round.bid,
          this.match.settings.maxBid
        );
      });
      select.options.add(new Option("pass", "pass", true, true));
    }

    _.each(validBids, validBid => {
      let bid = validBid.toString();
      select.options.add(new Option(bid, bid));
    });
    this.addElementToActionDiv(select);

    let makeBidButton = document.createElement("button");
    makeBidButton.innerHTML = "Make Bid";
    makeBidButton.onclick = () => {
      let bidValue = select.options[select.selectedIndex].value;

      this.match.makeBid(playerName, parseInt(bidValue));

      this._numberOfBidsMadeThisRound += 1;
      this._currentBidder = this.seatingArrangement.getPlayerToTheLeftOf(
        playerName
      );

      this.clearActionDiv();

      if (this._numberOfBidsMadeThisRound < this.numberOfPlayers) {
        this.collectBidFrom(this._currentBidder);
      } else {
        this.match.completeBidding();
        let h4 = document.createElement("h4");
        h4.innerHTML = `${
          this.match.round.bid.playerName
        } won the bidding with a bid of ${this.match.round.bid.amount}`;
        this.addElementToActionDiv(h4);

        let beginPlayingButton = document.createElement("button");
        beginPlayingButton.innerHTML = "Begin Playing";
        beginPlayingButton.onclick = () => {
          this.requestCardFrom(this.match.round.bid.playerName);
        };
        document.getElementById("action").appendChild(beginPlayingButton);
      }
    };
    this.addElementToActionDiv(makeBidButton);
  }

  public requestCardFrom(playerName: string) {
    this.displayCards();

    this.clearActionDiv();
    this.addTextToActionDiv(`${playerName}, please select a card.`);

    let cardsDiv = document.getElementById(
      this.tablePositions[playerName] + "Cards"
    );
    _.each(cardsDiv.getElementsByTagName("canvas"), cardCanvas => {
      cardCanvas.onclick = () => {
        let cardName = getCardNameByID(cardCanvas.id);
        let cardPlayed = this.match.playCard(cardName, playerName);
        if (!cardPlayed) {
          alert(`${playerName} cannot play the ${cardName}. Try again.`);
          this.requestCardFrom(playerName);
        } else {
          this.displayCards();
          if (_.size(this.match.trick.cardsPlayed) == this.numberOfPlayers) {
            let roundComplete = this.match.completeTrick();
            if (roundComplete) {
              let matchIsOver = this.match.completeRound();
              if (matchIsOver) {
                this.clearActionDiv();
                this.addTextToActionDiv("Match Complete!");
                this.addTextToActionDiv("Final Scores:");
                _.each(this.match.teams, team => {
                  this.addTextToActionDiv(`${team.name}: ${team.score}`);
                });
              } else {
                this.currentDealer = this.seatingArrangement.getPlayerToTheLeftOf(
                  this.currentDealer
                );
                this.startRound();
              }
            } else {
              this.requestCardFrom(this.match.trick.leadPlayer);
            }
          } else {
            this.requestCardFrom(
              this.seatingArrangement.getPlayerToTheLeftOf(playerName)
            );
          }
        }
      };
    });
  }
}
