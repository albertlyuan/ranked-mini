import app from "./getapp.js";
import { 
    getDatabase, 
    set, 
    query, 
    ref, 
    orderByChild, 
    orderByKey, 
    limitToLast, 
    get, 
    endAt, 
    push,
    orderByValue,
    update, 
    startAt} from "firebase/database";
import {STARTING_ELO, calculateNewElo, calculateTeamElo} from "../Elo/elo.js"

const db = getDatabase(app)

// const player_history = ref(db, '/player_history')
const player_now = ref(db, '/player_now')
const player_uid = ref(db, '/player_uid/')
const games = ref(db, '/games')
const STARTING_GAMEID = -1


export async function queryGamesSinceDate(date){
    const resp = (await get(
        query(ref(db,"games"), 
        orderByChild('timestamp'), 
        startAt(date)))
    ).val()
    return resp

}   
/**
 * 
 * @returns placeholder player object
 */export function blankPlayer(uid){
    return {
        uid: {
            elo: -1,
            game_id: -1,
            losses: -1,
            uid: uid,
            win_status: false,
            wins: -1,
            timestamp: -1
        }
    }
}

/**
 * Async function
 * @returns list of [name, elo, num wins, num losses, teams(list)]
 */
export async function buildLeaderboard(){

    const [nameToUids, players] = await firebase_getPlayers()
    const ranked = []
    const unranked = []
    console.log(nameToUids)
    for (const [name, uid] of nameToUids){
        console.log(uid)
        if (players[uid] == null){
            // alert(uid)
            continue
        }
        let teams = []
        if (players[uid].teams != null){
            teams = Object.keys(players[uid].teams)
        }
        
        if (players[uid].wins + players[uid].losses >= 10){
            ranked.push([name, players[uid].elo, players[uid].wins,players[uid].losses, teams])
        }else{
            unranked.push([name, players[uid].elo, players[uid].wins,players[uid].losses, teams])
        }
    }
    ranked.sort((a,b) => b[1]-a[1])
    unranked.sort((a,b) => (b[2]+b[3])-(a[2]+a[3]))
    return ranked.concat(unranked)
}

/**
 * 
 * @returns sorted list of [game_id, ts, winningTeam (list of names), losingTeam (list of names)]
 */
export async function getGamesLog(){
    const gameLog = (await get(query(games))).val()
    const uidToName = await getNamesFromUIDs()


    const gameLogObjects = []
    for (const g in gameLog){
        const winningTeam = [uidToName.get(gameLog[g]['winner_1']), uidToName.get(gameLog[g]['winner_2']), uidToName.get(gameLog[g]['winner_3'])]
        const losingTeam = [uidToName.get(gameLog[g]['loser_1']), uidToName.get(gameLog[g]['loser_2']), uidToName.get(gameLog[g]['loser_3'])]

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

export async function getNamesFromUIDs(){
    const uids = (await get(player_uid)).val()
    const ret = new Map()
    for (let [name,uid] of Object.entries(uids)){
        ret.set(uid,name)
    }
    return ret
}

export async function getNameFromUID(uid){
    const res = (await get(query(player_uid, orderByValue(), endAt(uid), limitToLast(1)))).val()
    return Object.keys(res)[0]
}


/**
 * adds new player to the database
 * @param {str} playerName 
 */
export function firebase_addNewPlayer(playerName){
    const ts = new Date().toISOString()
    playerName = playerName.trim()
    playerName = playerName.toLowerCase()
    const newKey = push(player_uid).key
    const updates = {};

    firebase_mapNameToUid(updates, playerName, newKey)
    console.log(updates)
    updatePlayerHistory(updates, newKey,STARTING_ELO,STARTING_GAMEID,0,0, ts, null, null)
    updatePlayerNow(updates, newKey,STARTING_ELO,STARTING_GAMEID,0,0,{})
    
    return update(ref(db), updates);
}

async function getUIDsFromNames(people){
    const ret = []
    for (let name of people){
        ret.push(await getUIDFromName(name))
    }
    return ret
}   

export async function getUIDFromName(name){
    const rawquery = await get(query(ref(db,"/player_uid/"+name)))
    return rawquery.val()
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
    const winners = await getUIDsFromNames([winner1,winner2,winner3])
    const losers = await getUIDsFromNames([loser1,loser2,loser3])
    const ts = new Date().toISOString()

    const updates = {}

    addToGamesTable(updates, newGameID, winners, losers, ts, winner_pulled)

    const [_, players] = await firebase_getPlayers()
    
    const winnerData = filterPlayerObjects(winners, players)
    const loserData = filterPlayerObjects(losers, players)

    const winningTeamElo = calculateTeamElo(Array.from(winnerData.values()))
    const losingTeamElo = calculateTeamElo(Array.from(loserData.values()))
    console.log(newGameID, winner_pulled)
    console.log("winning team: ", winners, winningTeamElo )
    console.log("losing team: ", losers, losingTeamElo )

    updateNewPlayerElo(updates, winnerData,winningTeamElo,losingTeamElo,newGameID, ts, true, winner_pulled)
    updateNewPlayerElo(updates, loserData,winningTeamElo,losingTeamElo,newGameID, ts, false, winner_pulled)

    console.log(updates)

    update(ref(db), updates);
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
function updateNewPlayerElo(updates, playerData, winningTeamElo, losingTeamElo, newGameID, ts, win_status, winner_pulled){
    for (const name of playerData.keys()){
        const oldElo = playerData.get(name)['elo']
        let wins = playerData.get(name)['wins']
        let losses = playerData.get(name)['losses']
        let teams = 'teams' in playerData.get(name) ? playerData.get(name)['teams'] : []

        console.log(name)
        const newElo = calculateNewElo(oldElo, winningTeamElo, losingTeamElo, win_status, wins+losses, winner_pulled)
        
        const diff = newElo - oldElo
        console.log(`(${wins}-${losses})`, oldElo, newElo,newGameID, `diff: ${diff}`)

        if (win_status){
            wins+=1
        }else{
            losses+=1
        }        

        updatePlayerHistory(updates, name,newElo,newGameID, wins, losses, ts, win_status, winner_pulled)
        updatePlayerNow(updates, name,newElo,newGameID,wins,losses, teams)
    }
}

/**
 * player_now object = {name: {elo, losses, most_recent_game, wins}}
 * @returns list of all player_now player objects
 */
async function firebase_getPlayers(){
    const nameToUids = Object.entries((await get(query(player_uid))).val())
    const players = (await get(query(player_now))).val()
    return [nameToUids, players]
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
function updatePlayerHistory(updates, uid,elo,game_id, wins, losses, ts, win_status, winner_pulled){
    const postDestination = '/player_history/'+uid+"/"+game_id
    const postData = {
        name: uid,
        elo: elo,
        game_id: game_id,
        wins: wins,
        losses: losses,
        win_status: win_status,
        timestamp: ts,
        winner_pulled: winner_pulled
    };
    updates[postDestination] = postData
}

/**
 * update player_now
 * @param {str} playerName 
 * @param {float} elo 
 * @param {int} game_id 
 * @param {int} wins 
 * @param {int} losses 
 */
function updatePlayerNow(updates, uid, elo, game_id, wins, losses, teams){
    const postDestination = '/player_now/'+uid
    const postData = {
        most_recent_game: game_id,
        elo: elo,
        wins: wins,
        losses: losses,
        teams: teams
    }
    updates[postDestination] = postData
}

async function firebase_mapNameToUid(updates, playerName, uid){
    const postDestination = '/player_uid/'+playerName
    const postData = uid
    updates[postDestination] = postData
}

/**
 * add new row to games table. also sorts winners and losers alphabetically
 * @param {int} newGameID 
 * @param {list} winners 
 * @param {list} losers 
 * @param {str} ts 
 */
function addToGamesTable(updates, newGameID, winners, losers, ts, winner_pulled){
    const postDestination = '/games/'+ newGameID
    const postData = {
        winner_1: winners[0],
        winner_2: winners[1],
        winner_3: winners[2],
        loser_1: losers[0],
        loser_2: losers[1],
        loser_3: losers[2],
        timestamp: ts,
        winner_pulled: winner_pulled
    }
    updates[postDestination] = postData

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
export async function firebase_getTotalPlayerData(uid){
    return new Promise((resolve, reject) => {
        get(query(ref(db,"player_history/"+uid), orderByChild('game_id')))
        .then(result =>{
            resolve(result.val())
        })
        .catch(error => {
            
            reject(blankPlayer(uid))
        })
    })
}

/**
 * 
 * @param {str} uid 
 * @param {int} gameid 
 * @returns player object of gameid and gameid - 1 (used to see elo of player at time of gameid)
 */
export async function firebase_getPlayerData(uid, gameid){
    
    const beforeStats = (await get(query(ref(db,"player_history/"+uid), orderByChild('game_id'), endAt(gameid - 1), limitToLast(1)))).val()
    const afterStats = (await get(query(ref(db,"player_history/"+uid), orderByChild('game_id'), endAt(gameid), limitToLast(1)))).val()
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
        const uid = (await get(query(ref(db, "/player_uid/"+player)))).val()
        const beforeAfterData = await firebase_getPlayerData(uid, parseInt(gameID))
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

export async function firebase_changeName(oldname, newname){
    const lowercaseOldName = oldname.toLowerCase()
    const lowercaseNewName = newname.toLowerCase()

    const uid = (await get(query(ref(db, "/player_uid/"+lowercaseOldName)))).val()
    if ((await get(query(ref(db, "/player_uid/"+lowercaseNewName)))).val()){
        return false
    }

    try{
        const updates = {}
        updates["/player_uid/"+lowercaseOldName] = null
        updates["/player_uid/"+lowercaseNewName] = uid
        return update(ref(db), updates);
    }catch{
        return false
    }
}

export async function addTeam(uid, team){
    const playerdest = "/player_now/" + uid +"/teams"
    const teamnamedest = "/teams/"
    let playerTeams = (await get(query(ref(db, playerdest)))).val()
    if (playerTeams==null){
        playerTeams = {}
    }
    playerTeams[team] = ''
    
    //add new team to teamlist
    let allteams = (await get(query(ref(db, teamnamedest)))).val()
    if (!allteams){
        allteams = {}
    }

    if (allteams[team]==null){
        allteams[team] = 0
    }
    allteams[team] += 1
    
    try{
        const updates = {}
        updates[playerdest] = playerTeams
        updates[teamnamedest] = allteams
        return update(ref(db), updates);
    }catch{
        return false
    }
}

export async function removeTeam(uid, team){
    const dest = "/player_now/" + uid +"/teams/"
    const teamnamedest = "/teams/"
    let playerTeams = (await get(query(ref(db, dest)))).val()
    if (playerTeams==null){
        return
    }
    delete playerTeams[team]

    let allteams = (await get(query(ref(db, teamnamedest)))).val()
    if (!allteams){
        allteams = {}
    }

    if (allteams[team]==null){
        allteams[team] = 0
    }
    allteams[team] -= 1

    if (allteams[team]<=0){
        delete allteams[team]
    }
    
    try{
        const updates = {}
        updates[dest] = playerTeams
        updates[teamnamedest] = allteams
        return update(ref(db), updates);
    }catch{
        return false
    }
}

export async function firebase_getPlayerTeams(uid){
    const dest = "/player_now/" + uid +"/teams/"
    const playerTeams = (await get(query(ref(db, dest)))).val()
    if (playerTeams==null){
        return []
    }
    return Object.keys(playerTeams)
}

export async function firebase_getAllTeams(){
    const allteams = (await get(query(ref(db, "/teams/")))).val()
    if (allteams==null){
        return []
    }
    return Object.keys(allteams)
}

