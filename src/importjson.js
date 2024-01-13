import * as firebase from './Firebase/database.js'
import * as elo from './Elo/elo.js'
import * as fs from 'fs'
import { 
    ref, 
    update
} from "firebase/database";
// async function changeGamesSchema(startingGameID){
//     const games = data[league]["games"]
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
//     updates[`/${league}/games/`] = games
//     update(ref(firebase.db), updates);
//     console.log("done")
// }
// changeGamesSchema(0)

async function loadjson(league, data){

    // //to change
    const games = data[league]["games"]
    const player_history = data[league]["player_history"]
    const player_now = data[league]["player_now"]

    //dont change these
    const name_uid = data[league]["player_uid"]
    const teams = data[league]["teams"]
    
    //games to reload
    const games_to_load = []
    
    //players to reset to 400
    const uids = new Set()

    //games to keep
    const original_games = {}
    for (let gameid = 0; gameid < games.length; gameid++){

        // <30 because first 30 games were unc games. we keep as is
        // if (gameid < 30){
        //     original_games[gameid] = games[gameid]
        //     continue
        // }

        const gameobj = games[gameid]
        console.log(gameobj)
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
        if (!player_now.hasOwnProperty(uid)){
            player_now[uid] = {}
        }
        player_now[uid]["elo"]=400
        player_now[uid]["losses"]=0
        player_now[uid]["wins"]=0
        player_now[uid]["most_recent_game"]=-1
        if (!player_history.hasOwnProperty(uid)){
            player_history[uid] = {}
            player_history[uid]["-1"] = {
                "elo": 400,
                "game_id": -1,
                "losses": 0,
                "name": uid,
                "timestamp": null,
                "wins": 0
              }
        }
        player_history[uid] = {"-1":player_history[uid]["-1"]}
    }
    const updates = {}
    updates[`/${league}/player_history/`] = player_history
    updates[`/${league}/games/`] = original_games
    updates[`/${league}/player_now/`] = player_now
    updates[`/${league}/player_uid/`] = name_uid

    update(ref(firebase.db), updates)

    // const games_to_load = []
    // for (const gameid of Object.keys(games)){
    //     if (gameid < startingGameID){
    //         continue
    //     }
    //     games_to_load.push(games[gameid])
    // }
    let breaks = 0
    let dynamic_pull_factor = true
    for (const game of games_to_load){

        const updates = {}
        if (game["winner_pulled"]){
            breaks += 1
        }
        
        const newGameID = await firebase.getNewGameID(league)
        // if (newGameID > 130){
        //     dynamic_pull_factor = true
        // }
        const winners = [game["winner_1"], game["winner_2"], game["winner_3"]] 
        const losers = [game["loser_1"], game["loser_2"], game["loser_3"]]
        const ts = game["timestamp"]
        const winner_pulled = game["winner_pulled"]

        //add to games
        updates[`${league}/games/`+ newGameID] = {
            winner_1: winners[0],
            winner_2: winners[1],
            winner_3: winners[2],
            loser_1: losers[0],
            loser_2: losers[1],
            loser_3: losers[2],
            timestamp: ts,
            winner_pulled: winner_pulled
        }

        const [_, players] = await firebase.firebase_getPlayers(league)

        const winnerData = firebase.filterPlayerObjects(winners, players)
        const loserData = firebase.filterPlayerObjects(losers, players)

        const winningTeamElo = elo.calculateTeamElo(Array.from(winnerData.values()))
        const losingTeamElo = elo.calculateTeamElo(Array.from(loserData.values()))
        
        console.log(newGameID, ts,"winner pulled:", winner_pulled)
        console.log("winners",winningTeamElo)
        // one by one log each game. need to await since each result is dependent on the prev
        await firebase.updateNewPlayerElo(league, updates, winnerData,winningTeamElo,losingTeamElo,newGameID, ts, true, winner_pulled, dynamic_pull_factor)
        console.log("losers",losingTeamElo)
        await firebase.updateNewPlayerElo(league, updates, loserData,winningTeamElo,losingTeamElo,newGameID, ts, false, winner_pulled, dynamic_pull_factor)
        // console.log(updates)
        await update(ref(firebase.db), updates);
    }

    console.log("breakpct: ",breaks/games_to_load.length)
}


// const filename = "testData.json"
// const leagueid = "test"
const filename = "uMPGdPCMakVoBdeSFK2I8Lw3XEs2.json"
const leagueid = "uMPGdPCMakVoBdeSFK2I8Lw3XEs2"

fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    try {
        const jsonData = JSON.parse(data);
        loadjson(leagueid,jsonData)
    } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
    }
});


