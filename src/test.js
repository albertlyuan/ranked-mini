import * as firebase from './Firebase/database.js'
import * as elo from './Elo/elo.js'


function addPlayers(players){
    for (let player of players){
        firebase.firebase_addNewPlayer(player)
    }
}
  
async function randomgame(players){
    const min = 0;
    const max = players.length-1;

    const winnerIdx = new Set();
    const loserIdx = new Set();


    while (winnerIdx.size < 3) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        winnerIdx.add(randomNumber);
    }

    while (loserIdx.size < 3) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (! winnerIdx.has(randomNumber)){
            loserIdx.add(randomNumber);
        }
    }


    const winners = []
    const losers = []
    for (let i = 0; i < players.length; i++){
        if (winnerIdx.has(i)){
            winners.push(players[i])
        }
        if (loserIdx.has(i)){
            losers.push(players[i])
        }
        
    }
    console.log("winners: "+winners)
    console.log("losers: "+losers)
    
    await firebase.firebase_logNewGame(winners[0], winners[1], winners[2], losers[0], losers[1], losers[2])
}

// const players = ["Alpha", "Bravo", "Charlie", 
//                 "Delta", "Echo", "Foxtrot", "Golf", "Hotel", 
//                 "India", "Juliett", "Kilo", "Lima", "Mike", 
//                 "November", "Oscar", "Papa", "Quebec", "Romeo", 
//                 "Sierra", "Tango", "Uniform", "Victor", "Whiskey", 
//                 "X-ray", "Yankee", "Zulu"]

// addPlayers(players)

// for (let i=0; i < 100;i++){
//     await randomgame(players)
// }

// firebase.deleteGame(9)
import data from "../7-24-23inputs.json" assert { type: 'json' };


async function load(){
    firebase.cleardb()
    console.log('deleted')
    const games = data["games"]
    const players = [
        "anna",
        "a li",
        "bodhi",
        "dawn",
        "ders",
        "henry",
        "jason",
        "jmac",
        "kevin",
        "kooski",
        "leo",
        "levi",
        "rut",
        "sarah",
        "suraj",
        "trev",
        "vincent",
        "x"
    ]
    addPlayers(players)
    let breaks = 0
    for (const game of games){
        if (game["winner_pulled"]){
            breaks += 1
        }
        await firebase.firebase_logNewGame(game["winner_1"], game["winner_2"], game["winner_3"], game["loser_1"], game["loser_2"], game["loser_3"], game["winner_pulled"])
    }
    console.log("breakpct: ",breaks/games.length)
}

load()
// firebase.firebase_addNewPlayer("test1")
// firebase.firebase_changeName("andrew li", "ders")
// firebase.getNameFromUID("-Nas6jgxwAcPPbJDdEV1").then(console.log)
// console.log(firebase.getUIDFromName("andrew li"))
// console.log(
// // dawn @199 team 198, lost to 188 received
// elo.calculateNewElo(199,188,198,false,14,true), 
// 32*(0-elo.expectedValue(198,188))/.3
// )

// console.log(
//     // a li @192 team 188, won 199 pulled
//     elo.calculateNewElo(192,188,198,true,14,true), 
//     32*(1-elo.expectedValue(192,198))/.3
//     )



