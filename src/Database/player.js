import { generateClient } from "aws-amplify/api";
import { updatePlayer, createPlayer, deletePlayer } from '../graphql/mutations.js';
import { listPlayers, getPlayer } from "../graphql/queries.js";
import { STARTING_ELO } from "../Elo/elo.js";
const client = generateClient()

export async function aws_createPlayer(leagueID, displayName){
    const newPlayer = await client.graphql({
        query: createPlayer,
        variables: {
            input: {
                "elo": STARTING_ELO,
                "wins": 0,
                "losses": 0,
                "leagueID": leagueID,
                "displayName": displayName
            }
        }
    });
}
export async function aws_updatePlayer(playerid, newElo, winCount, lossCount){
    try{
        const updatedPlayer = await client.graphql({
            query: updatePlayer,
            variables: {
                input: {
                "id": playerid, 
                "elo": newElo,
                "wins": winCount,
                "losses": lossCount,
            }
            }
        });
        return updatePlayer
    }catch(error){
        console.log(error)
    }
    
}
export async function aws_deletePlayer(userid){
    const deletedPlayer = await client.graphql({
        query: deletePlayer,
        variables: {
            input: {
                id: userid
            }
        }
    });
}

export async function aws_getAllPlayers(){
    // List all items
    const allPlayers = await client.graphql({
        query: listPlayers
    });
    return allPlayers
}

export async function aws_getUIDPlayerMap(leagueid){
    // List all items
    const data = (await aws_getLeaguePlayers(leagueid))
    if (data == null){
        return {}
    }
    const map = {}

    for (const player of data['data']['listPlayers']['items']){
        map[player.id] =  player.displayName
    }
    return map

}

export async function aws_getPlayer(userid){
    // Get a specific item
    try{
        const onePlayer = await client.graphql({
            query: getPlayer,
            variables: { id: userid }
        });
        return onePlayer
    }catch(error){
        alert("getplayer")
    }
}

export async function aws_getPlayerUID(leagueid, displayName){
    // Get a specific item
    try{
        const onePlayer = await client.graphql({
            query: listPlayers,
            variables: { filter: { 
                leagueID: { eq: leagueid },
                displayName: { eq: displayName }
            } }
        });
        return onePlayer
    }catch(error){
        alert("getplayeruid")
    }
    
}


export async function aws_getLeaguePlayers(leagueid){
    try{
        const leaguePlayers = await client.graphql({
            query: listPlayers,
            variables: { filter: { leagueID: { eq: leagueid } } }
        });
        return leaguePlayers
    }catch(error){
        alert("getleagueplayers")
    }
}

export async function aws_duplicateNameExists(leagueid, name){
    try{
        const leaguePlayers = await client.graphql({
            query: listPlayers,
            variables: { filter: { 
                leagueID: { eq: leagueid },
                displayName: {eq: name}
            } }
        });
        return leaguePlayers['data']['listPlayers']['items']
    }catch(error){
        alert("aws_duplicateNameExists")
    }
}