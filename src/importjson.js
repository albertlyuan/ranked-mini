import * as firebase from './Firebase/database.js'
import * as elo from './Elo/elo.js'
import { 
    ref, 
    update
} from "firebase/database";
import data from "../../11-12-23 wrong elo gen.json" assert { type: 'json' };
const startingGameid = 150

async function loadjson(startingGameID){
    
    const games = data[albertuser]["games"]
    // const players = data[albertuser]["player_uid"]

    const games_to_load = []
    for (const gameid of Object.keys(games)){
        if (gameid < startingGameID){
            continue
        }
        const gameobj = games[gameid]
        gameobj["game_id"] = gameid
        games_to_load.push(gameobj)
    }
    
    let breaks = 0
    const dynamic_pull_factor = true
    for (const game of games_to_load){
        const updates = {}
        if (game["winner_pulled"]){
            breaks += 1
        }
        
        const newGameID = await firebase.getNewGameID()
        const winners = [game["winner_1"], game["winner_2"], game["winner_3"]] 
        const losers = [game["loser_1"], game["loser_2"], game["loser_3"]]
        const ts = game["timestamp"]
        const winner_pulled = game["winner_pulled"]

        //add to games
        updates[`${albertuser}/games/`+ newGameID] = {
            winner_1: winners[0],
            winner_2: winners[1],
            winner_3: winners[2],
            loser_1: losers[0],
            loser_2: losers[1],
            loser_3: losers[2],
            timestamp: ts,
            winner_pulled: winner_pulled
        }

        const [_, players] = await firebase.firebase_getPlayers()

        const winnerData = firebase.filterPlayerObjects(winners, players)
        const loserData = firebase.filterPlayerObjects(losers, players)

        const winningTeamElo = elo.calculateTeamElo(Array.from(winnerData.values()))
        const losingTeamElo = elo.calculateTeamElo(Array.from(loserData.values()))
        
        console.log(newGameID, ts,"winner pulled:", winner_pulled)
        console.log("winners",winningTeamElo)
        await firebase.updateNewPlayerElo(updates, winnerData,winningTeamElo,losingTeamElo,newGameID, ts, true, winner_pulled, dynamic_pull_factor)
        console.log("losers",losingTeamElo)
        await firebase.updateNewPlayerElo(updates, loserData,winningTeamElo,losingTeamElo,newGameID, ts, false, winner_pulled, dynamic_pull_factor)
        update(ref(firebase.db), updates);
    }

    console.log("breakpct: ",breaks/games.length)
}

loadjson(startingGameid)