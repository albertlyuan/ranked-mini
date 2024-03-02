import { generateClient } from "aws-amplify/api";
import { updatePlayerHistory, createPlayerHistory, deletePlayerHistory} from '../graphql/mutations.js';
import { listPlayerHistories, getPlayerHistory } from "../graphql/queries.js";

const client = generateClient()

export async function createPlayerHistory_wrapper(newElo, winCount, lossCount, timestamp, userid, gameid){
    const newPlayerHistory = await client.graphql({
        query: createPlayerHistory,
        variables: {
            input: {
                "elo": newElo,
                "wins": winCount,
                "losses": lossCount,
                "timestamp": timestamp,
                "playerID": userid,
                "gameID": gameid
            }
        }
    });
}
export async function updatePlayerHistory_wrapper(newElo, winCount, lossCount, timestamp, userid, gameid){
    const updatedPlayerHistory = await client.graphql({
        query: updatePlayerHistory,
        variables: {
            input: {
                "elo": newElo,
                "wins": winCount,
                "losses": lossCount,
                "timestamp": timestamp,
                "playerID": userid,
                "gameID": gameid
            }
        }
    });
}

export async function deletePlayerHistory_wrapper(gameid){
    const deletedPlayerHistory = await client.graphql({
        query: deletePlayerHistory,
        variables: {
            input: {
                id: gameid
            }
        }
    });
}

export async function getAllPlayerHistory_wrapper(){
    // List all items
    const allPlayerHistorys = await client.graphql({
        query: listPlayerHistories
    });
    return allPlayerHistorys
}

export async function getPlayerHistory_wrapper(gameid){
    // Get a specific item
    const onePlayerHistory = await client.graphql({
        query: getPlayerHistory,
        variables: { id: gameid }
    });
    return onePlayerHistory
}
