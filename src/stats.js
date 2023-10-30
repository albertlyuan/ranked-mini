import * as firebase from './Firebase/database.js'
import * as elo from './Elo/elo.js'


async function Summary(days){
    const players = ["loser_1","loser_2","loser_3","winner_1","winner_2","winner_3"]
    let queryDate = new Date()
    queryDate.setDate(queryDate.getDate()-days)
    queryDate = queryDate.toISOString()
    const uidToName = await firebase.getNamesFromUIDs()
    const startelo = new Map() //uid: elo
    const startelo_incPlacements = new Map() //uid: elo
    const endelo = new Map() //uid: elo
    
    const games = await firebase.queryGamesSinceDate(queryDate)
    console.log("games played:", Object.entries(games).length)
    for (let [gameid, game] of Object.entries(games)){
        for (let p of players){
            let player = game[p]
            const playerdata = await firebase.firebase_getPlayerData(player, gameid)
            const beforeelo = Object.values(playerdata[0])[0].elo
            const afterelo = Object.values(playerdata[1])[0].elo
            const afterGames = Object.values(playerdata[1])[0].losses + Object.values(playerdata[1])[0].wins
            const beforeGames = Object.values(playerdata[0])[0].losses + Object.values(playerdata[0])[0].wins
            if (!startelo_incPlacements.has(player)){
                startelo_incPlacements.set(player, [beforeelo, beforeGames])
            }
            if (!startelo.has(player) & beforeGames >= 10){
                startelo.set(player, [beforeelo, beforeGames])
            }
            endelo.set(player,[afterelo,afterGames])
        }
    }
    const diffs = []
    const diffs_INCLplacements = []
    for (const [player, v] of endelo.entries()){
        if (startelo_incPlacements.has(player)){
            const playername = uidToName.get(player)
            const [finalElo, endNumGames] = v
            if (startelo.has(player)){
                const [startingElo, startNumGames] = startelo.get(player)
                diffs.push([playername, finalElo - startingElo, endNumGames-startNumGames])

            }
            const [startingElo_incPlacement, startNumGames_incPlacement] = startelo_incPlacements.get(player)
            diffs_INCLplacements.push([playername,(finalElo-startingElo_incPlacement).toFixed(2),endNumGames-startNumGames_incPlacement, finalElo.toFixed(2)])
            console.log(playername,":start:",startelo_incPlacements.get(player),"end:",v)
        }
    }
    diffs.sort((a,b) => b[1]-a[1])
    diffs_INCLplacements.sort((a,b) => b[1]-a[1])

    console.log(diffs)
    console.log(diffs_INCLplacements)
}
Summary(1)
