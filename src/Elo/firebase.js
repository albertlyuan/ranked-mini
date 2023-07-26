// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, set, query, ref, orderByChild, orderByKey, limitToLast, get, endAt} from "firebase/database";
import {STARTING_ELO, calculateNewElo, calculateTeamElo} from "./elo.js"

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2Hkd30F3HqihhhyvIQSmb7b75ew9_7qI",
  authDomain: "ranked-mini.firebaseapp.com",
  databaseURL: "https://ranked-mini-default-rtdb.firebaseio.com",
  projectId: "ranked-mini",
  storageBucket: "ranked-mini.appspot.com",
  messagingSenderId: "866464034729",
  appId: "1:866464034729:web:0f3478e4ca158c3f4cdeb8",
  measurementId: "G-RGP9QTVCLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
// const player_history = ref(db, '/player_history')
const player_now = ref(db, '/player_now')
const games = ref(db, '/games')
const STARTING_GAMEID = -1

/**
 * 
 * @returns placeholder player object
 */export function blankPlayer(name){
    return {
        name: {
            elo: -1,
            game_id: -1,
            losses: -1,
            name: name,
            win_status: false,
            wins: -1,
            timestamp: -1
        }
    }
}

/**
 * Async function
 * @returns list of [name, elo, num wins, num losses]
 */
export async function buildLeaderboard(){

    const players = await firebase_getPlayers()
    
    const leaderboard = []

    for (const name in players){
        leaderboard.push([name, players[name].elo, players[name].wins,players[name].losses])
    }
    leaderboard.sort((a,b) => b[1]-a[1])
    return leaderboard
}

/**
 * 
 * @returns sorted list of [game_id, ts, winningTeam (list of names), losingTeam (list of names)]
 */
export async function getGamesLog(){
    const gameLog = (await get(query(games))).val()
    const gameLogObjects = []
    for (const g in gameLog){
        const winningTeam = [gameLog[g]['winner_1'], gameLog[g]['winner_2'], gameLog[g]['winner_3']]
        const losingTeam = [gameLog[g]['loser_1'], gameLog[g]['loser_2'], gameLog[g]['loser_3']]
        const ts = gameLog[g]['timestamp']
        const puller = gameLog[g]['winner_pulled']
        winningTeam.sort((a, b) => a.localeCompare(b))
        losingTeam.sort((a, b) => a.localeCompare(b))

        gameLogObjects.push([g, ts, winningTeam,losingTeam, puller])
        console.log([g, ts, winningTeam,losingTeam, puller])
    }
    gameLogObjects.sort((a,b) => b[0]-a[0])
    return gameLogObjects
}

/**
 * adds new player to the database
 * @param {str} playerName 
 */
export function firebase_addNewPlayer(playerName){
    const ts = new Date().toString()
    playerName = playerName.trim()
    updatePlayerHistory(playerName,STARTING_ELO,STARTING_GAMEID,0,0, ts, null, null)
    updatePlayerNow(playerName,STARTING_ELO,STARTING_GAMEID,0,0)
}


/**
 * Log new game. updates player_now, adds row to player_history and games 
 * @param {str} winner1 
 * @param {str} winner2 
 * @param {str} winner3 
 * @param {str} loser1 
 * @param {str} loser2 
 * @param {str} loser3 
 */
export async function firebase_logNewGame(winner1, winner2, winner3, loser1, loser2,loser3, winner_pulled){
    const newGameID = await getNewGameID()
    const winners = [winner1,winner2,winner3]
    const losers = [loser1,loser2,loser3]
    const ts = new Date().toString()

    addToGamesTable(newGameID, winners, losers, ts, winner_pulled)

    const players = await firebase_getPlayers()
    
    const winnerData = filterPlayerObjects(winners, players)
    const loserData = filterPlayerObjects(losers, players)

    const winningTeamElo = calculateTeamElo(Array.from(winnerData.values()))
    const losingTeamElo = calculateTeamElo(Array.from(loserData.values()))
    console.log(newGameID, winner_pulled)
    console.log("winning team: ", winners, winningTeamElo )
    console.log("losing team: ", losers, losingTeamElo )

    await updateNewPlayerElo(winnerData,winningTeamElo,losingTeamElo,newGameID, ts, true, winner_pulled)
    await updateNewPlayerElo(loserData,winningTeamElo,losingTeamElo,newGameID, ts, false, winner_pulled)
}

/** 
 * @param {list} playernames - list of names 
 * @param {list} players - list of player objects
 * @returns map of player objects for each name in playernames
 */
function filterPlayerObjects(playernames, players){
    const playerObjects = new Map()
    for (const i of playernames){
        playerObjects.set(i, players[i])
    }
    return playerObjects
}

/**
 * update player_history and player_now tables
 * @param {map} playerData - map of {name: player object}
 * @param {float} winningTeamElo - team elo of winning team
 * @param {float} losingTeamElo - team elo of losing team
 * @param {int} newGameID - game id 
 * @param {str} ts - timestamp
 * @param {boolean} win_status - true if team won
 */
async function updateNewPlayerElo(playerData, winningTeamElo, losingTeamElo, newGameID, ts, win_status, winner_pulled){
    for (const name of playerData.keys()){
        const oldElo = playerData.get(name)['elo']
        let wins = playerData.get(name)['wins']
        let losses = playerData.get(name)['losses']
        console.log(name)
        const newElo = calculateNewElo(oldElo, winningTeamElo, losingTeamElo, win_status, wins+losses, winner_pulled)
        
        const diff = newElo - oldElo
        console.log(`(${wins}-${losses})`, oldElo, newElo,newGameID, `diff: ${diff}`)

        if (win_status){
            wins+=1
        }else{
            losses+=1
        }        

        await updatePlayerHistory(name,newElo,newGameID, wins, losses, ts, win_status, winner_pulled)
        await updatePlayerNow(name,newElo,newGameID,wins,losses)

    }
}

/**
 * player_now object = {name: {elo, losses, most_recent_game, wins}}
 * @returns list of all player_now player objects
 */
async function firebase_getPlayers(){
    const players = await get(query(player_now))
    const playerObjects = players.val()
    return playerObjects
}

/**
 * add new row to player_history
 * @param {str} playerName 
 * @param {float} elo 
 * @param {int} game_id 
 * @param {int} wins 
 * @param {int} losses 
 * @param {str} ts 
 * @param {boolean} win_status 
 */
async function updatePlayerHistory(playerName,elo,game_id, wins, losses, ts, win_status, winner_pulled){
    set(ref(db, '/player_history/'+playerName+"/"+game_id), {
        name: playerName,
        elo: elo,
        game_id: game_id,
        wins: wins,
        losses: losses,
        win_status: win_status,
        timestamp: ts,
        winner_pulled: winner_pulled
    })
}

/**
 * update player_now
 * @param {str} playerName 
 * @param {float} elo 
 * @param {int} game_id 
 * @param {int} wins 
 * @param {int} losses 
 */
async function updatePlayerNow(playerName, elo, game_id, wins, losses){
    await set(ref(db, '/player_now/'+playerName), {
        most_recent_game: game_id,
        elo: elo,
        wins: wins,
        losses: losses
    })
}


/**
 * add new row to games table. also sorts winners and losers alphabetically
 * @param {int} newGameID 
 * @param {list} winners 
 * @param {list} losers 
 * @param {str} ts 
 */
function addToGamesTable(newGameID, winners, losers, ts, winner_pulled){
    winners.sort((a, b) => a.localeCompare(b))
    losers.sort((a, b) => a.localeCompare(b))
    
    const newGameRef = ref(db, '/games/'+ newGameID);
    set(newGameRef, {
        winner_1: winners[0],
        winner_2: winners[1],
        winner_3: winners[2],
        loser_1: losers[0],
        loser_2: losers[1],
        loser_3: losers[2],
        timestamp: ts,
        winner_pulled: winner_pulled
    })
}

/**
 * finds most recently used gameid and returns that + 1
 * @returns int
 */
export async function getNewGameID(){
    const result = await get(query(games, orderByKey(), limitToLast(1)))
    if (result.val() != null){
        const mostRecentGameID = parseInt(Object.keys(result.val())[0])
        return mostRecentGameID + 1
    }
    return 0
}

/**
 * 
 * @param {str} name 
 * @returns list of player Objects for each game played by a player
 */
export function firebase_getTotalPlayerData(name){
    return new Promise((resolve, reject) => {
        get(query(ref(db,"player_history/"+name), orderByChild('game_id')))
        .then(result =>{
            resolve(result.val())
        })
        .catch(error => {
            
            reject(blankPlayer(name))
        })
    })
}

/**
 * 
 * @param {str} name 
 * @param {int} gameid 
 * @returns player object of gameid and gameid - 1 (used to see elo of player at time of gameid)
 */
export async function firebase_getPlayerData(name, gameid){

    const beforeStats = (await get(query(ref(db,"player_history/"+name), orderByChild('game_id'), endAt(gameid - 1), limitToLast(1)))).val()
    const afterStats = (await get(query(ref(db,"player_history/"+name), orderByChild('game_id'), endAt(gameid), limitToLast(1)))).val()
    return [beforeStats, afterStats]
}

/**
 * 
 * @param {list} players
 * @param {int} gameID 
 * @returns list of [name, elo, wins, losses] at the time of gameID
 */
export function queryGamePlayersData(players, gameID){
    let playerData = players.map(async player => {
        const beforeAfterData = await firebase_getPlayerData(player, parseInt(gameID))
        const before = Object.values(beforeAfterData[0])[0]
        const after = Object.values(beforeAfterData[1])[0]
        return [player,[before.elo, after.elo], before.wins, before.losses]
    })
    return Promise.all(playerData)
}

export async function deleteGame(gameid){
    const game  = (await get(query(ref(db,"/games/"+gameid)))).val()
    console.log(game)
}

export function cleardb(){ 
    set(ref(db,"/"), null)
}