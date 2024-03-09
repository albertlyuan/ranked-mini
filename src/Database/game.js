import { generateClient } from "aws-amplify/api";
import { updateGame, createGame, deleteGame } from '../graphql/mutations.js';
import { getGame, gamesByLeagueIDAndTimestamp } from "../graphql/queries.js";

const client = generateClient()

export async function aws_createGame(
    leagueID, ts, players, winner1, winner2, winner3, loser1, loser2, loser3,
    winner1data, winner2data, winner3data, loser1data, loser2data, loser3data,
    breakwin, pullFactor) {
    try {
        const newGame = await client.graphql({
            query: createGame,
            variables: {
                input: {
                    "leagueID": leagueID,
                    "timestamp": ts,
                    "players": players,
                    "loser1": loser1,
                    "loser1data": loser1data,
                    "loser2": loser2,
                    "loser2data": loser2data,
                    "loser3": loser3,
                    "loser3data": loser3data,
                    "winner1": winner1,
                    "winner1data": winner1data,
                    "winner2": winner2,
                    "winner2data": winner2data,
                    "winner3": winner3,
                    "winner3data": winner3data,
                    "winnerPulled": breakwin,
                    "pullfactor": pullFactor,
                }
            }
        });
        return newGame
    } catch (error) {
        console.log(error)
        alert("creategame")
    }




}
export async function aws_updateGame(
    leagueID, ts, winner1, winner2, winner3, loser1, loser2, loser3,
    winner1data, winner2data, winner3data, loser1data, loser2data, loser3data,
    breakwin, pullFactor) {

    const updatedGame = await client.graphql({
        query: updateGame,
        variables: {
            input: {
                "leagueID": leagueID,
                "timestamp": ts,
                "loser1": loser1,
                "loser1data": loser1data,
                "loser2": loser2,
                "loser2data": loser2data,
                "loser3": loser3,
                "loser3data": loser3data,
                "winner1": winner1,
                "winner1data": winner1data,
                "winner2": winner2,
                "winner2data": winner2data,
                "winner3": winner3,
                "winner3data": winner3data,
                "winnerPulled": breakwin,
                "pullfactor": pullFactor,
            }
        }
    });
}

export async function aws_deleteGame(gameid) {
    const deletedGame = await client.graphql({
        query: deleteGame,
        variables: {
            input: {
                id: gameid
            }
        }
    });
}

export async function aws_getLeagueGames(leagueid, numgames, nexttoken) {
    try {
        if (nexttoken == null){
            const allGames = await client.graphql({
                query: gamesByLeagueIDAndTimestamp,
                variables: { 
                    "leagueID": leagueid, 
                    "sortDirection": "DESC",
                    "limit": numgames
                },
            });
            return allGames
        }else{
            const allGames = await client.graphql({
                query: gamesByLeagueIDAndTimestamp,
                variables: { 
                    "leagueID": leagueid, 
                    "sortDirection": "DESC",
                    "limit": numgames,
                    "nextToken":nexttoken,
                },
            });
            return allGames
        }
        
        
    } catch (error) {
        console.log(error)
        alert("getleaguegames")

    }
}

export async function aws_getPlayerGames(leagueid, playeruid, numgames, nexttoken) {
    try {
        if (nexttoken != null){
            const allGames = await client.graphql({
                query: gamesByLeagueIDAndTimestamp,
                variables: { 
                    "leagueID": leagueid, 
                    "sortDirection": "DESC",
                    "limit": numgames,
                    "filter": {players: { contains: playeruid }},
                    "nextToken":nexttoken
                }
            });
            return allGames
        }else{
            const allGames = await client.graphql({
                query: gamesByLeagueIDAndTimestamp,
                variables: { 
                    "leagueID": leagueid, 
                    "sortDirection": "DESC",
                    "limit": numgames,
                    "filter": {players: { contains: playeruid }},
                }
            });
            return allGames
        }
    } catch (error) {
        console.log("getplayergames")
        console.log(error)
    }
}

export async function aws_getGame(gameid) {
    // Get a specific item
    try{
        const oneGame = await client.graphql({
            query: getGame,
            variables: { id: gameid }
        });
        return oneGame
    }catch(error){
        alert("getgame")
    }
}
