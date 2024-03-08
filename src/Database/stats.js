import { gamesByLeagueIDAndTimestamp, listGames } from "../graphql/queries.js";
import { generateClient } from "aws-amplify/api";
import { Amplify } from 'aws-amplify';
import config from '../aws-exports.js';
import { aws_getUIDPlayerMap } from "./player.js";
import { DayMonthDateYear } from "../Elo/dateutils.js";
Amplify.configure(config);
const client = generateClient()


async function getLastNdayGames(leagueid, days, token) {
    try {
        let queryDate = new Date()
        queryDate.setDate(queryDate.getDate()-days)
        queryDate = queryDate.toISOString()
        const allGames = await client.graphql({
            query: listGames,
            variables: { 
                "filter": {timestamp: { ge: queryDate }, and: {leagueID: {eq: leagueid}}},
                "nextToken": token
            },
        
        });
        return allGames
    } catch (error) {
        console.log(error)
        // alert("getplayergames")

    }
}

async function getGames(leagueid, days){
    let alldata = []
    let currtoken = null
    while (true){
        const data = await getLastNdayGames(leagueid,days, currtoken)
        alldata = alldata.concat(data['data']['listGames']['items'])
        currtoken = data['data']['listGames']['nextToken']
        if (currtoken == null){
            break
        }
        
    }
    alldata.sort((a,b)=>{
        const d1 = new Date(a['timestamp'])
        const d2 = new Date(b['timestamp'])
        return d1-d2
    })
    console.log(alldata.length)
    return alldata
}

async function Summary(leagueid, days){
    const games = await getGames(leagueid,days)
    
    const uidmap = await aws_getUIDPlayerMap(leagueid)

    const start = {}
    const start_incPlacements ={}
    const end = {}
    const players = ["loser1","loser2","loser3","winner1","winner2","winner3"]

    for (const game of games){
        for (const p of players){
            const name = uidmap[game[p]]

            const data = JSON.parse(game[`${p}data`])

            const beforeelo = data.oldElo
            const afterelo = data.newElo
            const afterGames = data.wins+data.losses
            const beforeGames = data.wins+data.losses - 1
            if (!start_incPlacements.hasOwnProperty(name)){
                start_incPlacements[name] = [beforeelo, beforeGames]
            }
            if (!start.hasOwnProperty(name) & beforeGames >= 10){
                start[name] = [beforeelo, beforeGames]
            }
            end[name]=[afterelo,afterGames]
        }
    }

    const diffs = []
    const diffs_INCLplacements = []
    for (const player in end){
        const v = end[player]
        if (start_incPlacements.hasOwnProperty(player)){
            const playername = player
            const [finalElo, endNumGames] = v
            if (start.hasOwnProperty(player)){
                const [startingElo, startNumGames] = start[player]
                diffs.push([playername, finalElo - startingElo, endNumGames-startNumGames])

            }
            const [startingElo_incPlacement, startNumGames_incPlacement] = start_incPlacements[player]
            diffs_INCLplacements.push([playername,(finalElo-startingElo_incPlacement).toFixed(2),endNumGames-startNumGames_incPlacement, finalElo.toFixed(2)])
            console.log(playername,":start:",start_incPlacements[player],"end:",v)
        }
    }
    diffs.sort((a,b) => b[1]-a[1])
    diffs_INCLplacements.sort((a,b) => b[1]-a[1])

    console.log("NO placements")
    console.log("name, elodiff, numgames")
    console.log(diffs)
    console.log("inc Placements")
    console.log("name, elodiff, numgames, CurrElo")
    console.log(diffs_INCLplacements)

}
const stoneleague = 'fa6db074-adf2-4364-9f76-aa6902a5dd3d'
Summary(stoneleague,1)