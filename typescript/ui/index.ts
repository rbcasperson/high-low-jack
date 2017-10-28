import {Match} from '../engine/src/match';
import {MatchHandler} from './matchHandler';


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
let matchHandler = new MatchHandler(match)

matchHandler.start()
