import { generateClient } from "aws-amplify/api";
import { updatePlayer, createPlayer, deletePlayer } from '../graphql/mutations.js';
import { listPlayers, getPlayer } from "../graphql/queries.js";
import { STARTING_ELO } from "../Elo/elo.js";
const client = generateClient()

export async function createPlayer_wrapper(leagueID, displayName){
    const newPlayer = await client.graphql({
        query: createPlayer,
        variables: {
            input: {
            "elo": STARTING_ELO,
            "wins": 0,
            "losses": 0,
            "leagueID": leagueID,
            "displayName": displayName,
            "PlayerHistories": []
        }
        }
    });
}
export async function updatePlayer_wrapper(newElo, winCount, lossCount, leagueID, displayName, player_history){
    const updatedPlayer = await client.graphql({
        query: updatePlayer,
        variables: {
            input: {
            "elo": newElo,
            "wins": winCount,
            "losses": lossCount,
            "leagueID": leagueID,
            "displayName": displayName,
            "PlayerHistories": player_history
        }
        }
    });
}
export async function deletePlayer_wrapper(userid){
    const deletedPlayer = await client.graphql({
        query: deletePlayer,
        variables: {
            input: {
                id: userid
            }
        }
    });
}

export async function getAllPlayers_wrapper(){
    // List all items
    const allPlayers = await client.graphql({
        query: listPlayers
    });
    return allPlayers
}

export async function getPlayer_wrapper(userid){
    // Get a specific item
    const onePlayer = await client.graphql({
        query: getPlayer,
        variables: { id: userid }
    });
    return onePlayer
}
