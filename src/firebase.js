// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, push, set, query, ref, orderByChild, orderByKey, limitToLast, get, equalTo } from "firebase/database";

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
const player_history = ref(db, '/player_history')
const player_ref = ref(db, '/player_ref')
const games = ref(db, '/games')
// const games = db.child('games')
const STARTING_ELO = 0

export function firebase_addNewPlayer(playerName){
    set(push(player_history), {
        name: playerName,
        elo: STARTING_ELO,
        game_id: -1,
        name_game: playerName+"_"+-1 
    })

    set(ref(db, '/player_ref/'+playerName), {
        name: playerName,
        most_recent_game: -1
    })
}
async function findMostRecentElo(name_game){
    // console.log("searching: ", name_game)
    const result = await get(query(player_history,orderByChild("name_game"),equalTo(name_game)))
    let obj = Object.values(result.val())[0]
    let ret = [obj.name, obj.elo]
    // console.log("found: " + ret)
    return ret
}

export async function firebase_getPlayers(){
    const players = await get(query(player_ref))
    // console.log(Object.values(players.val()))

    const eloPromises = Object.values(players.val()).map(async player => {
        const name_game = player.name + "_" + player.most_recent_game
        const elo = await findMostRecentElo(name_game)
        // console.log(name_game + " : " + elo)
        return elo
    })

    return Promise.all(eloPromises)
}

export function firebase_logNewGame(winner1, winner2, winner3, loser1, loser2,loser3){
    const newGameID = getNewGameID()
    const winners = [winner1,winner2,winner3]
    const losers = [loser1, loser2, loser3]

    addToGamesTable(newGameID, winners, losers)
    //add to player_history
    //update player_ref
}

function addToGamesTable(newGameID,winners, losers){
    const ts = new Date().toString()

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

export async function getNewGameID(){
    const result = await get(query(games, orderByKey(), limitToLast(1)))
    if (result.val() != null){
        const mostRecentGameID = parseInt(Object.keys(result.val())[0])
        return mostRecentGameID + 1
    }
    return 0
}
