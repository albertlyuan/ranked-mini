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
    startAt,
    equalTo} from "firebase/database";
import {STARTING_ELO, PULL_FACTOR, calculateNewElo, calculateTeamElo} from "../Elo/elo.js"

export const PULLFACTORGAMES = 30
export const albertuser = "7zDTQ16f3Sah2sOSncu3zLf6PeG3"

export const db = getDatabase(app)
// const player_history = ref(db, '/player_history')
// const games = ref(db, `/${albertuser}/games`)
const STARTING_GAMEID = -1

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
 * Async function. 
 */
export async function leagueExists(league){
    const res = (await get(query(ref(db,`/${league}`)))).val()
    if (res == null || res == "null" ){
        return false
    }
    return true
}

// /**
//  * Async function. 
//  * @returns list of [name, elo, num wins, num losses, teams(list)]
//  */
// export async function createLeague(leagueid){
//     await set(ref(db,`/${leagueid}`), {'games':{}, "player_history":{}, "player_now":{}, "player_uid":{}})
// }

/**
 * Async function. 
 * @returns list of [name, elo, num wins, num losses, teams(list)]
 */
export async function buildLeaderboard(league){
    const [nameToUids, players] = await firebase_getPlayers(league)
    const ranked = []
    const unranked = []
    // alert(nameToUids)
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
 * returns all game objects since `date`
 * @param {*} date - timestamp as iso string
 * @returns object of game objects
 */
export async function queryGamesSinceDate(league, date){
    const resp = (await get(
        query(ref(db,`${league}/games`), 
        orderByChild('timestamp'), 
        startAt(date)))
    ).val()
    return resp
}   

/**
 * 
 * @returns sorted list of [game_id, ts, winningTeam (list of names), losingTeam (list of names), puller]
 */
export async function getGamesLog(league){
    const gameLog = (await get(query(ref(db, `/${league}/games`)))).val()
    
    const ret = await createGameLogObjects(league, gameLog)
    return ret
}

/**
 * 
 * @param {*} league - league id 
 * @param {*} n - nth set of 30 games (0 indexed)
 * @returns sorted list of [game_id, ts, winningTeam (list of names), losingTeam (list of names), puller]
 */
const NUM_DISPLAY_GAMES = 20 
export async function getMostRecentGamesLog(league,pagenum){
    const most_recent_game = (await get(query(ref(db, `/${league}/games`), orderByKey(), limitToLast(1)))).val()

    const most_recent_game_id = Object.keys(most_recent_game)
    // alert(most_recent_game_id)
    const start = `${most_recent_game_id - (pagenum+1)*NUM_DISPLAY_GAMES}`
    const end = `${most_recent_game_id - pagenum*NUM_DISPLAY_GAMES}`
    const gameLog = (await get(query(ref(db, `/${league}/games`), orderByKey(), startAt(start), endAt(end)))).val()
    const ret = await createGameLogObjects(league, gameLog)
    return ret
}

/**
 * 
 * @param {str} gameid 
 * @returns one game object
 */
export async function getGame(league, gameid){
    const game = (await get(query(ref(db, `/${league}/games`), orderByKey(), endAt(gameid), limitToLast(1)))).val()
    const ret = await createGameLogObjects(league, game)
    return ret[0]
}

/**
 * helper function for getGamesLog and getPlayerGameLog
 * returns [game_id, ts, winningTeam (list of names), losingTeam (list of names), puller]
 * @param {*} queryGamesObj 
 */
async function createGameLogObjects(league, queryGamesObj){
    const uidToName = await getNamesFromUIDs(league)

    const gameLogObjects = []
    for (const g in queryGamesObj){
        const winningTeam = [uidToName.get(queryGamesObj[g]['winner_1']), uidToName.get(queryGamesObj[g]['winner_2']), uidToName.get(queryGamesObj[g]['winner_3'])]
        const losingTeam = [uidToName.get(queryGamesObj[g]['loser_1']), uidToName.get(queryGamesObj[g]['loser_2']), uidToName.get(queryGamesObj[g]['loser_3'])]

        const ts = queryGamesObj[g]['timestamp']
        const puller = queryGamesObj[g]['winner_pulled']
        winningTeam.sort((a, b) => a.localeCompare(b))
        losingTeam.sort((a, b) => a.localeCompare(b))

        gameLogObjects.push([g, ts, winningTeam,losingTeam, puller])
        console.log([g, ts, winningTeam,losingTeam, puller])
    }
    gameLogObjects.sort((a,b) => b[0]-a[0])
    return gameLogObjects

}
/**
 * GetGamesLog but for a specific uid
 * @returns sorted list of [game_id, ts, winningTeam (list of names), losingTeam (list of names), puller]
 */
export async function get30PlayerGameLog(league, uid){
    const playerData = await firebase_get30PlayerData(league,uid)

    const gameIDs = Object.keys(playerData)
    const allGames = {}
    for (let gid of gameIDs){
        const game = (await get(query(ref(db, `/${league}/games`), orderByKey(), endAt(gid), limitToLast(1)))).val()
        // console.log(game)
        allGames[gid] = game[gid]
    }
    // console.log(allGames)
    const ret = await createGameLogObjects(league, allGames)
    return ret
}

/**
 * GetGamesLog but for a specific uid
 * @returns sorted list of [game_id, ts, winningTeam (list of names), losingTeam (list of names), puller]
 */
export async function getPlayerGameLog(league, uid){
        const games = ref(db, `/${league}/games`)
    const winner_1 = (await get(query(games, orderByChild("winner_1"), equalTo(uid)))).val()
    const winner_2 = (await get(query(games, orderByChild("winner_2"), equalTo(uid)))).val()
    const winner_3 = (await get(query(games, orderByChild("winner_3"), equalTo(uid)))).val()
    const loser_1 = (await get(query(games, orderByChild("loser_1"), equalTo(uid)))).val()
    const loser_2 = (await get(query(games, orderByChild("loser_2"), equalTo(uid)))).val()
    const loser_3 = (await get(query(games, orderByChild("loser_3"), equalTo(uid)))).val()

    // const uidToName = await getNamesFromUIDs()
    const allGames = {
        ...winner_1,
        ...winner_2,
        ...winner_3,
        ...loser_1,
        ...loser_2,
        ...loser_3,
    }
    // console.log(allGames.length)
    const ret = await createGameLogObjects(league, allGames)
    return ret
}

/**
 * 
 * @returns map of uid: playername
 */
export async function getNamesFromUIDs(league){
    const uids = (await get(ref(db, `/${league}/player_uid/`))).val()
    const ret = new Map()
    if (uids == null){
        return ret
    }
    for (let [name,uid] of Object.entries(uids)){
        ret.set(uid,name)
    }
    return ret
}

/**
 * Get name (string) from uid
 * @param {*} uid 
 * @returns 
 */
export async function getNameFromUID(league, uid){
    const res = (await get(query(ref(db, `/${league}/player_uid/`), orderByValue(), endAt(uid), limitToLast(1)))).val()
    return Object.keys(res)[0]
}


/**
 * WRITES: adds new player to the database. 
 * @param {str} playerName 
 */
export async function firebase_addNewPlayer(league, playerName){
    const ts = new Date().toISOString()

    playerName = playerName.trim()
    playerName = playerName.toLowerCase()

    const newKey = push(ref(db, `/${league}/player_uid/`)).key //makes new key
    const updates = {};
    firebase_mapNameToUid(league, updates, playerName, newKey)
    updatePlayerHistory(league, updates, newKey,STARTING_ELO,STARTING_GAMEID,0,0, ts, null, null)
    updatePlayerNow(league, updates, newKey,STARTING_ELO,STARTING_GAMEID,0,0,{})
    
    // console.log(updates)
    update(ref(db), updates);
}

async function getUIDsFromNames(league, people){
    const ret = []
    for (let name of people){
        ret.push(await getUIDFromName(league, name))
    }
    return ret
}   

export async function getUIDFromName(league, name){
    const rawquery = await get(query(ref(db,`${league}/player_uid/`+name)))
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
export async function firebase_logNewGame(league, winner1, winner2, winner3, loser1, loser2,loser3, winner_pulled, dynamic_pull_factor=false){
    const newGameID = await getNewGameID(league)
    const winners = await getUIDsFromNames(league, [winner1,winner2,winner3])
    const losers = await getUIDsFromNames(league, [loser1,loser2,loser3])
    const ts = new Date().toISOString()
    
    const updates = {}

    addToGamesTable(league, updates, newGameID, winners, losers, ts, winner_pulled)

    const [_, players] = await firebase_getPlayers(league)
    
    const winnerData = filterPlayerObjects(winners, players)
    const loserData = filterPlayerObjects(losers, players)

    const winningTeamElo = calculateTeamElo(Array.from(winnerData.values()))
    const losingTeamElo = calculateTeamElo(Array.from(loserData.values()))

    await updateNewPlayerElo(league, updates, winnerData,winningTeamElo,losingTeamElo,newGameID, ts, true, winner_pulled, dynamic_pull_factor)
    await updateNewPlayerElo(league, updates, loserData,winningTeamElo,losingTeamElo,newGameID, ts, false, winner_pulled, dynamic_pull_factor)


    update(ref(db), updates);
}

/** 
 * @param {list} playernames - list of names 
 * @param {list} players - list of player objects
 * @returns map of player objects for each name in playernames
 */
export function filterPlayerObjects(playernames, players){
    const playerObjects = new Map()
    for (const i of playernames){
        playerObjects.set(i, players[i])
    }
    return playerObjects
}

/**
 * Calculate pull factor based on the last `numGames` games 
 * @param {int} numGames - number of games to draw from to calc new pull factor
 * @returns 
 */
export async function getCurrPullFactor(league, numGames){
    

    const mostRecentGames = (await get(query(ref(db, `/${league}/games`), orderByKey(), limitToLast(numGames)))).val()
    if (mostRecentGames == null || mostRecentGames.length < numGames){
        return 1
    }
    let break2win = 0
    for (const game of Object.values(mostRecentGames)){
        if (game["winner_pulled"]){
            break2win += 1
        }

    }

    const newPullFactor = (break2win/numGames) / (1-(break2win/numGames))
    if (newPullFactor == 0){
        return PULL_FACTOR
    }
    console.log("BreakPct:",break2win/numGames)
    console.log("PullFactor:",newPullFactor)
    return newPullFactor

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
export async function updateNewPlayerElo(league, updates, playerData, winningTeamElo, losingTeamElo, newGameID, ts, win_status, winner_pulled, dynamic_pull_factor){
    const currPullFactor = await getCurrPullFactor(league, PULLFACTORGAMES)
    const uidToName = await getNamesFromUIDs(league)

    for (const name of playerData.keys()){
        const oldElo = playerData.get(name)['elo']
        let wins = playerData.get(name)['wins']
        let losses = playerData.get(name)['losses']
        let teams = 'teams' in playerData.get(name) ? playerData.get(name)['teams'] : []

        let newElo = 0
        if (dynamic_pull_factor){
            newElo = calculateNewElo(oldElo, winningTeamElo, losingTeamElo, win_status, wins+losses, winner_pulled, currPullFactor)
        }else{
            newElo = calculateNewElo(oldElo, winningTeamElo, losingTeamElo, win_status, wins+losses, winner_pulled)
        }
        // const diff = newElo - oldElo
        // console.log(`${uidToName.get(name)} (${wins}-${losses})`, oldElo, newElo,newGameID, `diff: ${diff}`)

        if (win_status){
            wins+=1
        }else{
            losses+=1
        }        
        
        updatePlayerHistory(league, updates, name,newElo,newGameID, wins, losses, ts, win_status, winner_pulled)
        updatePlayerNow(league, updates, name,newElo,newGameID,wins,losses, teams)
    }
}

/**
 * player_now object = {name: {elo, losses, most_recent_game, wins}}
 * @returns list of all player_now player objects
 */
export async function firebase_getPlayers(league){
    const playeruids = (await get(query(ref(db, `/${league}/player_uid/`)))).val()
    const players = (await get(query(ref(db, `/${league}/player_now`)))).val()
    // console.log(league,playeruids,players)
    if (playeruids != null){
        const nameToUids = Object.entries(playeruids)
        return [nameToUids, players]
    }
    return [[],players]

}

/**
 * WRITES: add new row to player_history
 * @param {str} playerName 
 * @param {float} elo 
 * @param {int} game_id 
 * @param {int} wins 
 * @param {int} losses 
 * @param {str} ts 
 * @param {boolean} win_status 
 */
function updatePlayerHistory(league, updates, uid,elo,game_id, wins, losses, ts, win_status, winner_pulled){
    const postDestination = `/${league}/player_history/`+uid+"/"+game_id
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
 * WRITES: update player_now
 * @param {str} playerName 
 * @param {float} elo 
 * @param {int} game_id 
 * @param {int} wins 
 * @param {int} losses 
 */
function updatePlayerNow(league, updates, uid, elo, game_id, wins, losses, teams){
    const postDestination = `/${league}/player_now/`+uid
    const postData = {
        most_recent_game: game_id,
        elo: elo,
        wins: wins,
        losses: losses,
        teams: teams
    }
    updates[postDestination] = postData
}

/**
 * WRITES: creates a new item in player_uid mapping name: uid
 * @param {*} updates - list of updates in the transaction
 * @param {*} playerName - name as string 
 * @param {*} uid - player uid
 */
async function firebase_mapNameToUid(league, updates, playerName, uid){
    const postDestination = `/${league}/player_uid/`+playerName
    const postData = uid
    updates[postDestination] = postData
}

/**
 * WRITES: add new row to games table. also sorts winners and losers alphabetically
 * @param {int} newGameID 
 * @param {list} winners 
 * @param {list} losers 
 * @param {str} ts 
 */
function addToGamesTable(league, updates, newGameID, winners, losers, ts, winner_pulled){
    const postDestination = `${league}/games/`+ newGameID
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
export async function getNewGameID(league){

    const result = await get(query(ref(db, `/${league}/games`), orderByKey(), limitToLast(1)))
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
export async function firebase_getTotalPlayerData(league, uid){
    const res = (await get(query(ref(db,`${league}/player_history/`+uid), orderByChild('game_id')))).val()
    return res
}

/**
 * 
 * @param {str} name 
 * @returns list of player Objects for each game played by a player
 */
export async function firebase_get30PlayerData(league, uid){
    const res = (await get(query(ref(db,`${league}/player_history/`+uid), orderByChild('game_id'), limitToLast(30)))).val()
    return res
}

/**
 * 
 * @param {str} uid 
 * @param {int} gameid 
 * @returns player object of gameid and gameid - 1 (used to see elo of player at time of gameid)
 */
export async function firebase_getPlayerData(league, uid, gameid){
    const beforeStats = (await get(query(ref(db,`/${league}/player_history/`+uid), orderByChild('game_id'), endAt(gameid - 1), limitToLast(1)))).val()
    const afterStats = (await get(query(ref(db,`/${league}/player_history/`+uid), orderByChild('game_id'), endAt(gameid), limitToLast(1)))).val()
    return [beforeStats, afterStats]
}

/**
 * 
 * @param {list} players
 * @param {int} gameID 
 * @returns list of [name, elo, wins, losses] at the time of gameID
 */
export function queryGamePlayersData(league, players, gameID){
    let playerData = players.map(async player => {
        const uid = (await get(query(ref(db, `${league}/player_uid/`+player)))).val()
        const beforeAfterData = await firebase_getPlayerData(league, uid, parseInt(gameID))
        const before = Object.values(beforeAfterData[0])[0]
        const after = Object.values(beforeAfterData[1])[0]
        return [player,[before.elo, after.elo], [before.wins, before.losses], [after.wins, after.losses]]
    })
    return Promise.all(playerData)
}

/**
 * **probably not used**
 * @param {*} gameid 
 */
// export async function deleteGame(league, gameid){
//     const game  = (await get(query(ref(db,`${league}/games/`+gameid)))).val()
//     console.log(game)
// }

/**
 * **probably not used**
 */
async function cleardb(league){ 
    await set(ref(db,`/${league}/`), null)
}

/**
 * WRITES: change display name of a give uid
 * @param {*} oldname 
 * @param {*} newname 
 * @returns 
 */
export async function firebase_changeName(league, oldname, newname){
    const lowercaseOldName = oldname.toLowerCase()
    const lowercaseNewName = newname.toLowerCase()

    const uid = (await get(query(ref(db,`${league}/player_uid/`+lowercaseOldName)))).val()
    if ((await get(query(ref(db, `${league}/player_uid/`+lowercaseNewName)))).val()){
        return false
    }

    try{
        const updates = {}
        updates[`${league}/player_uid/`+lowercaseOldName] = null
        updates[`${league}/player_uid/`+lowercaseNewName] = uid
        await update(ref(db), updates);
        return true
    }catch{
        return false
    }
}

/**
 * deprecated
 * WRITES: adds new team to team list
 * @param {*} uid 
 * @param {*} team 
 * @returns 
 */
export async function addTeam(league, uid, team){
    const playerdest = `${league}/player_now/` + uid +"/teams"
    const teamnamedest = `${league}/teams/`
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

/**
 * WRITES: removes team from team list
 * @param {*} uid 
 * @param {*} team 
 * @returns 
 */
export async function removeTeam(uid, team){
    const dest = `${albertuser}/player_now/` + uid +"/teams/"
    const teamnamedest = `${albertuser}/teams/`
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
    const dest = `${albertuser}/player_now/` + uid +"/teams/"
    const playerTeams = (await get(query(ref(db, dest)))).val()
    if (playerTeams==null){
        return []
    }
    return Object.keys(playerTeams)
}

export async function firebase_getAllTeams(){
    const allteams = (await get(query(ref(db, `${albertuser}/teams/`)))).val()
    if (allteams==null){
        return []
    }
    return Object.keys(allteams)
}

/**
 * **test use only**
 * WRITES: changes date.toString() to date.toISOString()
 * @returns 
 */
export async function changeDatesToISO(league){
    // used to change dates from Date.ToString to Date.ToISOString()

    const updates = {}

    const allgames = (await get(query(ref(db, `${league}/games/`)))).val()
    for (let game of Object.keys(allgames)){
        const dest = `${league}/games/`+game+"/timestamp"
        const oldDate = allgames[game]["timestamp"]
        const newDate = new Date(oldDate).toISOString()
        console.log(dest)
        console.log(oldDate)
        console.log(newDate)
        updates[dest] = newDate
    }
    
    const allphistory = (await get(query(ref(db, `${league}/player_history/`)))).val()

    for (let uid of Object.keys(allphistory)){
        for (let game of Object.keys(allphistory[uid])){
            console.log(uid + " " + game)
            const dest = `${league}/player_history/`+uid+"/"+game+"/timestamp"
            const oldDate = allphistory[uid][game]["timestamp"]
            const newDate = new Date(oldDate).toISOString()
            console.log(dest)
            console.log(oldDate)
            console.log(newDate)
            updates[dest] = newDate
        }
    }
    try{
        return update(ref(db), updates)
    }catch{
        return false
    }
}

export async function firebase_loadTest(testdb, testjson){
    // await cleardb(testdb)
    // for (const p of testroster){
    //     await firebase_addNewPlayer(testdb,p[0])
    // }
    await set(ref(db,`/${testdb}/`), testjson)
}
