import * as _ from "lodash";

import { Card } from "./deck";

export class Player {
  public name: string;
  public team: string;
  public hand: Card[] = [];

  public constructor(playerName: string, teamName: string) {
    this.name = playerName;
    this.team = teamName;
  }
}
