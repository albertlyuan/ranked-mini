import * as firebase from './Firebase/database.js'
import * as elo from './Elo/elo.js'

// THIS FILE IS SOLELY USED FOR THE TESTING FUNCTIONS OUTSIDE OF REACT


  
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
//edit file to just have "games" and "player_uid" lists
// function addPlayers(players){
//     for (let player of players){
//         firebase.firebase_addNewPlayer(player)
//     }
// }

// const uid = "-NdGxDFrv7IlQqL_S_lO"
// firebase.addTeam(uid,"brimstone").then(console.log)

// firebase.firebase_addNewPlayer("test1")
// firebase.firebase_changeName("andrew li", "ders")
// firebase.getNameFromUID("-Nas6jgxwAcPPbJDdEV1").then(console.log)
// console.log(firebase.getUIDFromName("andrew li"))
// console.log(
// // dawn @199 team 198, lost to 188 received
// elo.calculateNewElo(199,188,198,false,14,true)
// 32*(0-elo.expectedValue(198,188))/.3
// )

// console.log(
//    // a li @192 team 188, won 199 pulled
//     elo.calculateNewElo(192,188,198,true,14,true) 
//     32*(1-elo.expectedValue(192,198))/.3
//     )
// console.log(elo.calculateNewElo(152.05,446.77,505.38,true,7,false))
// console.log(elo.calculateNewElo(152.05,446.77,505.38,true,7,false)-152.05)



// console.log('chris')
// console.log(elo.calculateNewElo(152.05,505.38,446.77,false,7,true))
// console.log(elo.calculateNewElo(152.05,505.38,446.77,false,7,true)-152.05)

// console.log('bert')
// console.log(elo.calculateNewElo(683.49,505.38,446.77,true,25,true))
// console.log(elo.calculateNewElo(683.49,505.38,446.77,true,25,true)-683.49)


// firebase.firebase_addNewPlayer("test1")


// firebase.changeDatesToISO().then(console.log)

// console.log(
//     elo.calculateNewElo(192,188,198,true,14,true,await firebase.getCurrPullFactor(100)),
//     elo.calculateNewElo(192,188,198,true,14,true) 

//     )

// firebase.getCurrPullFactor(firebase.PULLFACTORGAMES).then(console.log)
// firebase.getUIDFromName("andy").then((uid)=>{
//     firebase.getPlayerGameLog(uid)
// })
// firebase.getGame(firebase.albertuser,"174").then((g)=>{
//     console.log(g)
// })
// import * as fs from 'fs'
// fs.readFile("./tests/testData.json", 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading the file:', err);
//         return;
//     }
//     // Parse the JSON data
//     try {
//         const jsonData = JSON.parse(data);
//         firebase.firebase_loadTest("test",jsonData)
//     } catch (jsonError) {
//         console.error('Error parsing JSON:', jsonError);
//     }
//   });
// function f(a,b,c,d,e,f,g){
//     console.log(a,b,c,d,e,f,g)
//     return true
// }
// const a = {winner1: "a", winner2: "a",winner3:"a",loser1:"a",loser2:"a",loser3:"a"}

// f(...Object.values(a),"b")
import * as league from "./Database/league.js"
import { Amplify } from 'aws-amplify';
import config from './aws-exports.js';
Amplify.configure(config);
league.listAdminLeagues("f1bb9540-e061-70bc-866e-7b4a4cd5c5fa").then((d)=>{
  console.log(d['data']['listLeagues']['items'])
})
