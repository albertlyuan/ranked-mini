import { aws_getPlayerUID, aws_updatePlayer } from "./player.js";
import { PULL_FACTOR, calculateNewElo, calculateTeamElo, PULLFACTORGAMES } from "../Elo/elo.js";
import { aws_getLeague, aws_updateLeagueBreaks } from "./league.js";
import { aws_createGame } from "./game.js";
import { useEffect, useState } from "react";


export async function reportNewGame(leagueID, leaguebreaks, winner1, winner2,winner3, loser1, loser2, loser3, breakwin, dynamic_pull_factor=false){
    const ts = new Date().toISOString()
    const winners = await getPlayerData(leagueID, [winner1,winner2,winner3])
    const losers = await getPlayerData(leagueID, [loser1,loser2,loser3])

    const winningTeamElo = calculateTeamElo(winners)
    const losingTeamElo = calculateTeamElo(losers)

    let currPullFactor = getPullfactor(dynamic_pull_factor, leaguebreaks)


    aws_updateLeagueBreaks(leagueID, updateBreaks(leaguebreaks, breakwin) )

    const winnerData = await updatePlayers(winners, winningTeamElo, losingTeamElo, true, breakwin,currPullFactor)
    const loserData = await updatePlayers(losers, winningTeamElo, losingTeamElo,false, breakwin,currPullFactor)
    const players = [winners[0].id, winners[1].id,winners[2].id, losers[0].id, losers[1].id, losers[2].id]
    const gameid = (await aws_createGame(leagueID, ts, players, winners[0].id, winners[1].id,winners[2].id, 
                                                    losers[0].id, losers[1].id, losers[2].id, 
                                                    winnerData[0], winnerData[1], winnerData[2], 
                                                    loserData[0],loserData[1],loserData[2],
                                                    breakwin, currPullFactor))
}


async function getPlayerData(leagueID, players){
    const playerData = players.map(async displayname =>{
        return (await aws_getPlayerUID(leagueID, displayname))['data']['listPlayers']['items'][0]
    })
    return Promise.all(playerData)

}

function updatePlayers(players, winningTeamElo, losingTeamElo, win, breakwin, currPullFactor){
    const playerdata =  players.map(async player =>{
        const newElo = calculateNewElo(player.elo, winningTeamElo, losingTeamElo, win, player.wins+player.losses, breakwin, currPullFactor)
        if (win){
            player.wins += 1
        }else{
            player.losses += 1
        }
        const updatedPlayer = await aws_updatePlayer(player.id, newElo, player.wins, player.losses)
        return `{\"oldElo\": ${player.elo}, \"newElo\": ${newElo}, \"wins\": ${player.wins}, \"losses\": ${player.losses}}`
    })
    return Promise.all(playerdata)
}
function updateBreaks(breaks, breakwin){
    if (breaks == null){
        return breakwin ? "1": "0"
    }
    if (breaks.length < PULLFACTORGAMES){
        return breakwin ? breaks+"1": breaks+"0"
    }
    return breakwin ? breaks.substring(1)+"1": breaks.substring(1)+"0"
    
}
function getPullfactor(dynamic_pull_factor, breaks){
    if (dynamic_pull_factor){
        if (breaks == null || breaks.length < PULLFACTORGAMES){
            return 1
        }
        let numbreaks = 0
        for (const i of breaks){
            if (i == '1'){
                numbreaks += 1
            }
        }
        return numbreaks == 0 ? PULL_FACTOR : (numbreaks/PULLFACTORGAMES) / (1-(numbreaks/PULLFACTORGAMES))
        
    }else{
        return PULL_FACTOR
    }
}