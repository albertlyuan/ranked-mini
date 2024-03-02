import { generateClient } from "aws-amplify/api";
import { updateGame, createGame, deleteGame } from '../graphql/mutations.js';
import { listGames, getGame } from "../graphql/queries.js";

const client = generateClient()

export async function createGame_wrapper(timestamp, loser1, loser2, loser3, winner1, winner2,winner3, breakwin, leagueID,players_histories){
    const newGame = await client.graphql({
        query: createGame,
        variables: {
            input: {
                "timestamp": timestamp,
                "loser1": loser1,
                "loser2": loser2,
                "loser3": loser3,
                "winner1": winner1,
                "winner2": winner2,
                "winner3": winner3,
                "winnerPulled": breakwin,
                "leagueID": leagueID,
                "PlayerHistories": players_histories
            }
        }
    });
}
export async function updateGame_wrapper(timestamp, loser1, loser2, loser3, winner1, winner2,winner3, breakwin, leagueID,players_histories){
    const updatedGame = await client.graphql({
        query: updateGame,
        variables: {
            input: {
                "timestamp": timestamp,
                "loser1": loser1,
                "loser2": loser2,
                "loser3": loser3,
                "winner1": winner1,
                "winner2": winner2,
                "winner3": winner3,
                "winnerPulled": breakwin,
                "leagueID": leagueID,
                "PlayerHistories": players_histories
            }
        }
    });
}

export async function deleteGame_wrapper(gameid){
    const deletedGame = await client.graphql({
        query: deleteGame,
        variables: {
            input: {
                id: gameid
            }
        }
    });
}

export async function getAllGames_wrapper(){
    // List all items
    const allGames = await client.graphql({
        query: listGames
    });
    return allGames
}

export async function getGame_wrapper(gameid){
    // Get a specific item
    const oneGame = await client.graphql({
        query: getGame,
        variables: { id: gameid }
    });
    return oneGame
}
