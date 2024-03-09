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

// player.aws_getPlayerUID(stoneleague, 'bos').then(data =>{
//     console.log(data['data']['listPlayers']['items'])
// })
// const a = 'eyJ2ZXJzaW9uIjozLCJ0b2tlbiI6IkFnVjRqZ2F0eVRXOE9BNDJVUHRSOGdRVm9oczdhaE5Pck4zYy9vWlZKbnM4YU80QWV3QUNBQWRCY0hCVGVXNWpBQkZGYm1OeWVYQjBhVzl1UTI5dWRHVjRkQUFWWVhkekxXTnllWEIwYnkxd2RXSnNhV010YTJWNUFFUkJNMnh3U1hjMlZWWXpkRWg0VW1sRE5GSk1kMFJZV1RsQ1J6VlFUamxxZFV4SVNrNVNRVE0yTTNNclVHRkZUMHRTZFRCVGFtaDFTREF5Um5KUlRtNVFNM2M5UFFBQkFBZGhkM010YTIxekFFdGhjbTQ2WVhkek9tdHRjenAxY3kxbFlYTjBMVEk2T0RFeE9EY3pOalF5TXprd09tdGxlUzlrWmpneVpXWmtZeTFpTW1JMUxUUTVZakV0T1dRMU1pMDNaREZrTldOalkyVTBNV01BdUFFQ0FRQjRCUU40TWdxdUtWUmRWWHZvMU93ZVE1VnEyajRlMkJ3ZlFlb0pHT2VOWnlNQk94MEhqZ2hYYTZLMkNPSWlYNkg0RHdBQUFINHdmQVlKS29aSWh2Y05BUWNHb0c4d2JRSUJBREJvQmdrcWhraUc5dzBCQndFd0hnWUpZSVpJQVdVREJBRXVNQkVFRE5LYkxQa2tIUGtrYm1mNDF3SUJFSUE3QW52SEdCeDBONkZNUDVrVFc3TVVVVzNjWUNORGY2SGR0YzE2Q3dMQnN0MVl4bTRrVHJOUUt0NHhqN2FIa0g1S3FXbFV1UkloRWdwR2NQa0NBQUFRQUh0aDBUa3VKNnlLWVRoanBkWUM0UmJwdmRzRXhEaXZNWUtlYzc5dVlKOElxUTlGc3NPeTlHZ05iYmQ5V3BJY0N2Ly8vLzhBQUFBQkFBQUFBQUFBQUFBQUFBQUJBQUFES3ZzSk9HeE9EbnlDTDNwWCtld21qekVKZXF3eFlBMHRnZjJIY2UyaTZ1RndMakl3YnBTdFlYZGhtclNqRmJyaUNUeHJKMkZYYXFnRmk5a256OGtqQVhJUXk5UFVrYXBYSlVrLzF6OXI1T3dPbHNjZGpHMjFhTTZSMmNRWEpQREtTdnVZSXB5aVBqcUtWVHM2ZURnZHVnTVAxSXplbGZMNXJJZmM5WGlJeFgrTWcxUVlZQ1hwVFpFelhqNWIreXpkTlM4OWdiV1k1dWpzRjJ1dEl0aDdnK3JEUjlocUk4L0dja1E5d2N0Qm9iRmVrQmp1cTEzTGlOYTJWWndNeG1YZjhVcUd0aU1oa2ZrdzgvaDMzdm5JREdGMCtBTVpGb1lnVzVqRmxDVzNXVTBZeXZXdlFNU3N5VnZpcU0yRmFZTm5XRHpDMzhyZzFOUENBa1hKa1o0U1BESzhnMnkxUWo4RnlJZVh2b1JmdGxSbEtZRW5xQkJDNHBtNWN6TEJ3S211b0pwTVZGdHRVaG03YlYyUjJRL2dyVGFHczZiTXo0Q09UWEswZXptUWxnOTdQeVhPbVVRUW0wa2o1VEZrVXU4djRXdnFtUjlucXBGK0pjZVNWalc1ZDBpY1cxNUJWQ0FEbXhhMmt6TllIZkJVbVF6VFFRZkgwblg3MkpIOWhQZVkxRXZpWWMvTml3aXdTcWprSjlZLzg1aVpxRW9kUGk0clo4MXRpZU1HN2YrLzYzWFQzeG9RSUhsRjVXQUJpWEtUVVdDcWtFVFZnMEZZT2Z5RHYxVkQ1OEpwbWkvTVFWK0F1MnlFYWdUZkI2Y1l6M0NTRjdyWFZUV3hRZE1Qc0RFQjN3c1MxUnl6RitvaFlkcTYxczd4RHNkVFJOb1VRVFhLSkNBd0QvY05rSHVKcjROc25oKzdFQ3B6L1QvbmJZTnE5djlmc1VpUGRXZ0RsaHhIc3k5S0RFWXM3SnlmRXdDcDhPNEc1eUt6VGp2MWYyWVhaUkJ3d0hNR2R3Mlc3R0FtdnBTV1FDWjh5eFlyUHo0bXVUdjZXcklQRzcxTmVhd0pmMDRnaURMcXNtd1dCUVVzUzdLUGNhWEJDeDZyVUt5ZG5iZW9BU2hxUUt5U00rOUd3aXA3K3NZZlhDL0E1UU5PbGtIbUkwNGt6aWIxZlFZbFpCS1FmcU1HNm5Jc0pQTnJLZzhnQlBGNXp2ZkF0MHRsUkNZRVVsMFlWd1krc0FpbG1JM2orME1TTXpjWXk1czZIdHp1dDF1WWN4M0xvOGh4Z2pzK3BMTGFIL2YybmhVaU1UYU1Dam5TUEd5ZDdOVjBQazZjY25OdG5rb2pTZHI1VitRNHpkZXpLc09rNkMwbk85dkJaMzRmU0x4NXQxeXhYL0lZQmV3ZXQ3Y0k4OTk1b2xXQXhXMStCV2diNGlBb010ZXkzZ3EyV3MxU0plVjdCSE5rMWRUYUtaZ1pvQjBBWnpCbEFqQlk1K25TTXZDcnpXU2dnT2pyL3Q4OENONDlZNVZhZXl2ZlRBSGw2aVE1UWxkWVBFck9wVXlzOXJZbGRVWnVpYmtDTVFEeW93bnV0Y2E5bXRIMHUvZlp2MWJCYXBUK2VGNm9GNHhkRkpUUE1oUlcxNmFMNmx5YVJWVmdJZDRKWUJXSitiST0ifQ=='
game.aws_getPlayerGames("fa6db074-adf2-4364-9f76-aa6902a5dd3d", "527cb372-039c-4bdc-9e51-f583cfbd4e97", 50, a).then(data =>{
    const games = data['data']['gamesByLeagueIDAndTimestamp']['items']
                        
    const token = data['data']['gamesByLeagueIDAndTimestamp']['nextToken']

    if (token){
        console.log(token)
    }else{
        console.log(null)
    }
    if (games.length == 0){
        console.log("empty")
    }
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
