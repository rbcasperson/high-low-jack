import * as _ from "lodash";

import { Card } from "./deck";

export class Team {
  public score: number = 0;
  public players: string[];
  public cardsWon: Card[] = [];
  public trumpCardsWon: Card[] = [];
  public name: string;

  public constructor(teamName: string, playerNames: string[]) {
    this.name = teamName;
    this.players = playerNames;
  }
}
