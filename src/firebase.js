// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, push, set, query, ref, orderByChild, orderByKey, limitToLast, get, child, equalTo } from "firebase/database";

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

export function firebase_getPlayers(){
    get(query(player_ref))
    .then(snapshot => {
        // alert(Object.keys(snapshot.val()))
        const list = []
        snapshot.forEach(player => {
            let name_game = player.val().name + "_" + player.val().most_recent_game
            get(query(player_history,orderByChild("name_game"),equalTo(name_game)))
            .then(result => {
                // alert(name_game+" "+result.val())
                list.push([result.val().name, result.val().elo])
            })
        })
    })
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
    const ts = new Date()

    winners.sort((a, b) => a.localeCompare(b))
    losers.sort((a, b) => a.localeCompare(b))

    const newGameRef = ref(games, '/'+newGameID);
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

export function getNewGameID(){
    get(query(games, orderByKey(), limitToLast(1)))
    .then(res =>{
        return res
    })
    // games.orderByChild('game_id').limitToLast(1).once('value')
    // .then(snapshot => {
    //   const data = snapshot.val();
    //   if (data) {
    //     // Retrieve the maximum value
        
    //     const keys = Object.keys(data);
    //     const maxKey = keys[0];
    //     const maxValue = data[maxKey].fieldName;
    //     return maxValue + 1
    //   } else {
    //     return 0
    //   }
    // })
}
