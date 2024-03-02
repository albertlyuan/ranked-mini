import * as game from './Database/game.js'
import * as player from './Database/player.js'
import * as league from './Database/league.js'
import * as playerHistory from './Database/playerHistory.js'
import * as fs from 'fs'


const filename = "./ranked-mini-default-rtdb-export.json"

const test = 'KTADcHMg24fTPi7MD9HBu0lZIzx2'
const rdu = 'VN1a7FvDVBfRAPQWdiOoE612muI2'
const stone = 'uMPGdPCMakVoBdeSFK2I8Lw3XEs2'
function awsMigrate(leagueid, jsonData){
    const games = jsonData[leagueid]['games']
    const history  = jsonData[leagueid]['player_history']
    const now  = jsonData[leagueid]['player_now']
    const names2uids = jsonData[leagueid]['player_uid']

    // league.createLeague_wrapper()
    console.log(jsonData[leagueid])

}

fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    try {
        const jsonData = JSON.parse(data);
        awsMigrate(test,jsonData)
    } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
    }
});

