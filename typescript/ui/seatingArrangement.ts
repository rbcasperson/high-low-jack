import * as _ from "lodash";

import { Team } from "../engine/src/team";

export class SeatingArrangement {
  public teams: Team[];
  public playerOrder: string[];
  public playerInfo: {
    [playerName: string]: {
      playerToLeft: string;
      playerToRight: string;
    };
  };

  public constructor(teams) {
    this.teams = _.shuffle(teams);

    let allPlayersInTeams: string[][] = [];
    _.each(this.teams, team => {
      allPlayersInTeams.push(_.shuffle(team.players));
    });
    this.playerOrder = _.flatten(_.unzip(allPlayersInTeams));

    this.playerInfo = {};
    _.each(_.range(this.playerOrder.length), playerIndex => {
      let playerName = this.playerOrder[playerIndex];
      let playerToLeft = undefined;
      let playerToRight = undefined;

      if (playerIndex == 0) {
        playerToLeft = this.playerOrder[this.playerOrder.length - 1];
        playerToRight = this.playerOrder[playerIndex + 1];
      } else if (playerIndex == this.playerOrder.length - 1) {
        playerToLeft = this.playerOrder[playerIndex - 1];
        playerToRight = this.playerOrder[0];
      } else {
        playerToLeft = this.playerOrder[playerIndex - 1];
        playerToRight = this.playerOrder[playerIndex + 1];
      }

      this.playerInfo[playerName] = {
        playerToLeft: playerToLeft,
        playerToRight: playerToRight
      };
    });
  }

  public getPlayerToTheLeftOf(player: string): string {
    return this.playerInfo[player].playerToLeft;
  }

  public getPlayerToTheRightOf(player: string): string {
    return this.playerInfo[player].playerToRight;
  }
}
