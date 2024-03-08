import * as game from './Database/game.js'
import * as player from './Database/player.js'
import * as league from './Database/league.js'
import * as fs from 'fs'

import { Amplify } from 'aws-amplify';
import config from './aws-exports.js';
import { reportNewGame } from './Database/reportNewGame_functions.js';
Amplify.configure(config);

const filename = "./ranked-mini-default-rtdb-export.json"

const test = 'KTADcHMg24fTPi7MD9HBu0lZIzx2'
const rdu = 'VN1a7FvDVBfRAPQWdiOoE612muI2'
const stone = 'uMPGdPCMakVoBdeSFK2I8Lw3XEs2'

const newtest = 'ccf1d43d-98ca-4320-8bf6-09d1183eb658'
const newstone = 'fa6db074-adf2-4364-9f76-aa6902a5dd3d'
const dynamicPF = true

async function awsMigrate(leagueid, jsonData){
    const games = jsonData[leagueid]['games']
    const history  = jsonData[leagueid]['player_history']
    const now  = jsonData[leagueid]['player_now']
    const names2uids = jsonData[leagueid]['player_uid']

    // await createplayers(names2uids)
    const uid2namemap = makeuidmap(names2uids)
    for (const g of games.slice(1)){

    // for (const g of games){
        // console.log(i)
        const breakwin = g['winner_pulled']
        const leagueinfo = await league.aws_getLeague(newstone)
        // console.log(leagueinfo)
        // console.log(g)
        const breaks = leagueinfo['data']['getLeague'].breaks
        await reportNewGame(newstone, g['timestamp'], breaks, 
            uid2namemap[g['winner_1']],uid2namemap[g['winner_2']], uid2namemap[g['winner_3']], 
            uid2namemap[g['loser_1']], uid2namemap[g['loser_2']], uid2namemap[g['loser_3']], 
            breakwin, dynamicPF)
        
    }
}
function makeuidmap(names2uids){
    const d = {}
    for (const i in names2uids){
        // console.log(i)
        d[names2uids[i]] = i
    }
    return d
}

async function createplayers(names2uids){
    const a = Object.keys(names2uids).map(async (p) =>{
        return player.aws_createPlayer(newstone,p)
    })
    return Promise.all(a)
    
}

fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    try {
        const jsonData = JSON.parse(data);
        awsMigrate(stone,jsonData)
    } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
    }
});

