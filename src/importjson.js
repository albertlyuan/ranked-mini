import * as firebase from './Firebase/database.js'
import * as elo from './Elo/elo.js'
import { 
    ref, 
    update
} from "firebase/database";
import data from "./ranked-mini-default-rtdb-export dynamic pullFactor.json" assert { type: 'json' };
const startingGameid = 150
// async function changeGamesSchema(startingGameID){
//     const games = data[firebase.albertuser]["games"]
//     for (const g of Object.keys(games)){
//         const winners = []
//         const losers = []
//         winners.push(games[g]["winner_1"])
//         winners.push(games[g]["winner_2"])
//         winners.push(games[g]["winner_3"])
//         losers.push(games[g]["loser_1"])
//         losers.push(games[g]["loser_2"])
//         losers.push(games[g]["loser_3"])
//         const newEntry = {
//             "winners":winners.join(" "),
//             "losers":losers.join(" "),
//             "timestamp":games[g]["timestamp"],
//             "winner_pulled":games[g]["winner_pulled"],
//         }
//         games[g] = newEntry
//     }
//     const updates = {}
//     updates[`/${firebase.albertuser}/games/`] = games
//     update(ref(firebase.db), updates);
//     console.log("done")
// }
// changeGamesSchema(0)

async function loadjson(startingGameID){
    // console.log(Object.keys(data[firebase.albertuser]))

    // //to change
    const games = data[firebase.albertuser]["games"]
    const player_history = data[firebase.albertuser]["player_history"]
    const player_now = data[firebase.albertuser]["player_now"]

    //dont change these
    const name_uid = data[firebase.albertuser]["player_uid"]
    const teams = data[firebase.albertuser]["teams"]
    
    //games to reload
    const games_to_load = []
    
    //players to reload
    const uids = new Set()

    //games to keep
    const original_games = {}
    for (const gameid of Object.keys(games)){
        if (gameid < 30){
            original_games[gameid] = games[gameid]
            continue
        }
        const gameobj = games[gameid]
        gameobj["game_id"] = gameid
        games_to_load.push(gameobj)
        uids.add(gameobj["loser_1"])
        uids.add(gameobj["loser_2"])
        uids.add(gameobj["loser_3"])
        uids.add(gameobj["winner_1"])
        uids.add(gameobj["winner_2"])
        uids.add(gameobj["winner_3"])
    }

    //refresh players before rerender
    for (const uid of uids){
        player_now[uid]["elo"]=400
        player_now[uid]["losses"]=0
        player_now[uid]["wins"]=0
        player_now[uid]["most_recent_game"]=-1
        player_history[uid] = {"-1":player_history[uid]["-1"]}
    }
    const updates = {}
    updates[`/${firebase.albertuser}/player_history/`] = player_history
    updates[`/${firebase.albertuser}/games/`] = original_games
    updates[`/${firebase.albertuser}/player_now/`] = player_now

    update(ref(firebase.db), updates)

    // const games_to_load = []
    // for (const gameid of Object.keys(games)){
    //     if (gameid < startingGameID){
    //         continue
    //     }
    //     games_to_load.push(games[gameid])
    // }
    let breaks = 0
    let dynamic_pull_factor = false
    for (const game of games_to_load){
        const updates = {}
        if (game["winner_pulled"]){
            breaks += 1
        }
        
        const newGameID = await firebase.getNewGameID()
        if (newGameID > 130){
            dynamic_pull_factor = true
        }
        const winners = [game["winner_1"], game["winner_2"], game["winner_3"]] 
        const losers = [game["loser_1"], game["loser_2"], game["loser_3"]]
        const ts = game["timestamp"]
        const winner_pulled = game["winner_pulled"]

        //add to games
        updates[`${firebase.albertuser}/games/`+ newGameID] = {
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
        await update(ref(firebase.db), updates);
    }

    console.log("breakpct: ",breaks/games_to_load.length)
}

// loadjson(startingGameid)