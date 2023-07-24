import * as firebase from './firebase.js'

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

const players = ["Alpha", "Bravo", "Charlie", 
                "Delta", "Echo", "Foxtrot", "Golf", "Hotel", 
                "India", "Juliett", "Kilo", "Lima", "Mike", 
                "November", "Oscar", "Papa", "Quebec", "Romeo", 
                "Sierra", "Tango", "Uniform", "Victor", "Whiskey", 
                "X-ray", "Yankee", "Zulu"]

// addPlayers(players)

for (let i=0; i < 100;i++){
    await randomgame(players)
}

// firebase.deleteGame(9)


