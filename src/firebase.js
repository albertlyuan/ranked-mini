// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, set, query, ref, orderByChild, orderByKey, limitToLast, get, endAt } from "firebase/database";

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
const STARTING_ELO = 400
const STARTING_GAMEID = -1

export function blankPlayer(name){
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

export async function buildLeaderboard(){
    const players = await firebase_getPlayers()
    
    const leaderboard = []

    for (const name in players){
        leaderboard.push([name, players[name].elo, players[name].wins,players[name].losses])
    }
    leaderboard.sort((a,b) => b[1]-a[1])
    return leaderboard
}

export async function getGamesLog(){
    const gameLog = (await get(query(games))).val()
    const gameLogObjects = []
    for (const g in gameLog){
        const winningTeam = [gameLog[g]['winner_1'], gameLog[g]['winner_2'], gameLog[g]['winner_3']]
        const losingTeam = [gameLog[g]['loser_1'], gameLog[g]['loser_2'], gameLog[g]['loser_3']]
        const ts = gameLog[g]['timestamp']
        winningTeam.sort((a, b) => a.localeCompare(b))
        losingTeam.sort((a, b) => a.localeCompare(b))

        gameLogObjects.push([g, ts, winningTeam,losingTeam])
    }
    gameLogObjects.sort((a,b) => b[0]-a[0])
    return gameLogObjects
}

export function firebase_addNewPlayer(playerName){
    const ts = new Date().toString()
    updatePlayerHistory(playerName,STARTING_ELO,STARTING_GAMEID,0,0, ts, null)
    updatePlayerNow(playerName,STARTING_ELO,STARTING_GAMEID,0,0)
}


// firebase_getPlayers().then(console.log)

export async function firebase_logNewGame(winner1, winner2, winner3, loser1, loser2,loser3){
    const newGameID = await getNewGameID()
    const winners = [winner1,winner2,winner3]
    const losers = [loser1,loser2,loser3]
    const ts = new Date().toString()

    // console.log('gameid: ' + (newGameID))
    addToGamesTable(newGameID, winners, losers, ts)
    // console.log('Added To Games Table')

    const players = await firebase_getPlayers()
    
    const winnerData = getPlayerObjects(winners, players)
    const loserData = getPlayerObjects(losers, players)

    const winningTeamElo = calculateTeamElo(Array.from(winnerData.values()))
    const losingTeamElo = calculateTeamElo(Array.from(loserData.values()))
    
    await updateNewPlayerElo(winnerData,winningTeamElo,losingTeamElo,newGameID, ts, true)
    await updateNewPlayerElo(loserData,winningTeamElo,losingTeamElo,newGameID, ts, false)

    // console.log("added to playertables")
}

//helper function for firebase_logNewGame
function getPlayerObjects(playernames, players){
    const playerObjects = new Map()
    for (const i of playernames){
        playerObjects.set(i, players[i])
    }
    return playerObjects
}

async function updateNewPlayerElo(playerData, winningTeamElo, losingTeamElo, newGameID, ts, win_status){
    for (const name of playerData.keys()){
        const oldElo = playerData.get(name)['elo']
        const newElo = calculateNewElo(oldElo, winningTeamElo, losingTeamElo, win_status)
        let wins = playerData.get(name)['wins']
        let losses = playerData.get(name)['losses']

        if (win_status){
            wins+=1
        }else{
            losses+=1
        }        

        // const diff = newElo - oldElo
        // console.log(name,`(${wins}-${losses})`, newElo,newGameID, `diff: ${diff}`)

        await updatePlayerHistory(name,newElo,newGameID, wins, losses, ts, win_status)
        await updatePlayerNow(name,newElo,newGameID,wins,losses)

    }
}

async function firebase_getPlayers(){
    const players = await get(query(player_now))
    const playerObjects = players.val()
    return playerObjects
}

async function updatePlayerHistory(playerName,elo,game_id, wins, losses, ts, win_status){
    set(ref(db, '/player_history/'+playerName+"/"+game_id), {
        name: playerName,
        elo: elo,
        game_id: game_id,
        wins: wins,
        losses: losses,
        win_status: win_status,
        timestamp: ts
    })
}

async function updatePlayerNow(playerName, elo, game_id, wins, losses){
    await set(ref(db, '/player_now/'+playerName), {
        most_recent_game: game_id,
        elo: elo,
        wins: wins,
        losses: losses
    })
}
//elo expected value
const K = 32
const D = 400

function calculateNewElo(playerElo, winningTeamElo, losingTeamElo, win_boolean){
    if (win_boolean){
        return playerElo + K*(1-expectedValue(playerElo,losingTeamElo))
    }else{
        const player_team_elo = Math.min(playerElo,losingTeamElo)
        return Math.max(0,playerElo + K*(0-expectedValue(player_team_elo,winningTeamElo)))
    }
}
function expectedValue(playerElo, opponentElo){
    return 1/(1+10**((opponentElo-playerElo)/D))
}

//logistic curve for weighted individual elo
// const L = 100
// const slope = 0.005
// const midpoint = 500

function calculateTeamElo(team){
    
    const weightedRank = (elo) => {
        return elo
        // return L / (1+ Math.E**(-slope*(elo-midpoint)))
    }

    const p1 = team[0].elo
    const p2 = team[1].elo
    const p3 = team[2].elo

    const teamElo = (weightedRank(p1) + weightedRank(p2) + weightedRank(p3)) / 3
    // console.log("team: " + teamElo)
    // console.log("people:"+ p1 + " " + p2 + " " + p3)
    return teamElo
}
// console.log(calculateTeamElo(0, 0, 0))

//helper function for firebase_logNewGame
function addToGamesTable(newGameID, winners, losers, ts){
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
        timestamp: ts
    })
}

//helper function for firebase_logNewGame
export async function getNewGameID(){
    const result = await get(query(games, orderByKey(), limitToLast(1)))
    if (result.val() != null){
        const mostRecentGameID = parseInt(Object.keys(result.val())[0])
        return mostRecentGameID + 1
    }
    return 0
}

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

export function firebase_getPlayerData(name, gameid){
    return new Promise((resolve, reject) => {
        get(query(ref(db,"player_history/"+name), orderByChild('game_id'), endAt(gameid - 1), limitToLast(1)))
        .then(result =>{
            resolve(result.val())
        })
        .catch(error => {
            reject(blankPlayer(name))
        })
    })
}

// getPlayerData("b", 7).then(console.log)
// getPlayerData("a",0).then(console.log)

export async function queryGamePlayersData(players, gameID){
    let playerData = players.map(async player => {
        const playerData = Object.values(await firebase_getPlayerData(player, gameID))[0]
        const asdf = [player,playerData.elo, playerData.wins, playerData.losses]
        return asdf
    })
    return Promise.all(playerData)
}
// queryGamePlayersData(['a','b','c'], 0).then(console.log)



// getNewGameID().then(a => console.log("game_id: " + a))

