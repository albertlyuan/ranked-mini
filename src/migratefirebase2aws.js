import * as game from './Database/game.js'
import * as player from './Database/player.js'
import * as league from './Database/league.js'
import * as fs from 'fs'

import { Amplify } from 'aws-amplify';
import config from './aws-exports.js';
Amplify.configure(config);

const filename = "./ranked-mini-default-rtdb-export.json"

const test = 'KTADcHMg24fTPi7MD9HBu0lZIzx2'
const rdu = 'VN1a7FvDVBfRAPQWdiOoE612muI2'
const stone = 'uMPGdPCMakVoBdeSFK2I8Lw3XEs2'

const newtest = 'ccf1d43d-98ca-4320-8bf6-09d1183eb658'
const newstone = 'fa6db074-adf2-4364-9f76-aa6902a5dd3d'

function awsMigrate(leagueid, jsonData){
    const games = jsonData[leagueid]['games']
    const history  = jsonData[leagueid]['player_history']
    const now  = jsonData[leagueid]['player_now']
    const names2uids = jsonData[leagueid]['player_uid']

    for (const p of Object.keys(names2uids)){
        player.aws_createPlayer(newtest, p)
    }

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

