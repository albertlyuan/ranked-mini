import * as firebase from './Firebase/database.js'
import * as elo from './Elo/elo.js'

import * as league from "./Database/league.js"
import * as game from "./Database/game.js"
import * as player from "./Database/player.js"

import { Amplify } from 'aws-amplify';
import config from './aws-exports.js';

import { reportNewGame } from './Database/reportNewGame_functions.js';
import { createChartData, getEloHistory } from './Player/playerDataUtils.js';
import { gamesByLeagueIDAndTimestamp } from './graphql/queries.js'
Amplify.configure(config);

const testleague = 'ccf1d43d-98ca-4320-8bf6-09d1183eb658'
const testplayer = "c85e9b90-dec3-463a-8f83-ea74ed20a404"
const stoneleague = 'fa6db074-adf2-4364-9f76-aa6902a5dd3d'
const dynamicPF = true
const breakwin = true
// let i = 0
// let token = null
// while (true){
//     i += 1
//     const d = await game.aws_getLeagueGames(testleague, 10, token)
//     token = d['data']['gamesByLeagueIDAndTimestamp']['nextToken']
//     console.log(d['data'])
//     console.log(i)
//     if (token == null){
//         break
//     }
    
    
// }
// league.aws_getLeague('fa6db074-adf2-4364-9f76-aa6902a5dd3d').then(console.log)

player.aws_getPlayerUID(stoneleague, 'bos').then(data =>{
    console.log(data['data']['listPlayers']['items'])
})

game.aws_getPlayerGames(stoneleague,'bebccb0b-6ed0-4d88-b8be-9099edc336f2',100).then(data =>{
    console.log(data['data']['gamesByLeagueIDAndTimestamp']['items'])
    console.log(data['data']['gamesByLeagueIDAndTimestamp']['items'].length)
})

// await player.aws_createPlayer(testleague,"p1")
// await player.aws_createPlayer(testleague,"p2")
// await player.aws_createPlayer(testleague,"p3")
// await player.aws_createPlayer(testleague,"p4")
// await player.aws_createPlayer(testleague,"p5")
// await player.aws_createPlayer(testleague,"p6")

// await reportNewGame(testleague, 'p1','p2','p3','p4','p5','p6',breakwin, dynamicPF)
// await reportNewGame(testleague, 'p1','p2','p3','p4','p5','p6',!breakwin, dynamicPF)
// await reportNewGame(testleague, 'p1','p2','p5', 'p3','p4','p6',breakwin, dynamicPF)
// await reportNewGame(testleague, 'p1','p2','p3','p4','p5','p6',breakwin, dynamicPF)
// await reportNewGame(testleague, 'p1','p2','p3','p4','p5','p6',!breakwin, dynamicPF)
// await reportNewGame(testleague, 'p1','p2','p5', 'p3','p4','p6',breakwin, dynamicPF)


// game.aws_getPlayerGames(testleague, testplayer, 10).then((d)=>{
//     console.log(d['data']['gamesByLeagueIDAndTimestamp'])
// })
// game.aws_getLeagueGames("ccf1d43d-98ca-4320-8bf6-09d1183eb658", 10).then(log => {
//         if (log['data'] != null){
//             console.log(log['data']['gamesByLeagueIDAndTimestamp']['items'])
//         }
//     })

// game.aws_getGame("6892e729-6779-483d-9138-f19fe76cb6ab").then((g)=>{
//     if (g){
//         console.log(g)
//     }
// })

// game.aws_getLeagueGames(testleague, 3).then(log => {
//     if (log['data'] != null){
//         // setCurrPageGames(log['data']['listGames']['items'])
//         console.log(log['data'])

//         console.log(log['data']['listGames']['items'])
//     }
// })

// let a = '1010110101011'
// for (const i in a){
//   console.log(i)
// }
// console.log(a)
// a = a.substring(1) + '1'
// console.log(a)

// league.aws_getLeague(testleague).then(console.log)

// league.aws_getLeague("ccf1d43d-98ca-4320-8bf6-09d1183eb658").then((d)=>{
//   const adminid = d['data']['getLeague']['adminUID']
//   console.log(adminid)
// })


// player.aws_duplicateNameExists("ccf1d43d-98ca-4320-8bf6-09d1183eb658","p2").then((d)=>{
//   console.log(d)
// })

// league.aws_listAdminLeagues("f1bb9540-e061-70bc-866e-7b4a4cd5c5fa").then((d)=>{
//   console.log(d['data']['listLeagues']['items'])
// })
