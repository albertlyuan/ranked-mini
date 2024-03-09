export function formatChartData(elos, timestamps, elogain, gameWinners, gameLosers, pullers){
    const dataobj = {
        labels: Array.from({length: elos.length}, (_, n) => n),
        datasets: [
            {
                label: "Elo",
                data: elos,
                backgroundColor: "black",
                borderColor:"black",
                borderWidth: 2
            },
            {
                label: "timestamps",
                data: timestamps,
                hidden: true,
            },
            {
                label: "elogain",
                data: elogain,
                hidden: true,
            },
            {
                label: "winners",
                data: gameWinners,
                hidden: true,
            },
            {
                label: "losers",
                data: gameLosers,
                hidden: true,
            },
            {
                label: "pulled",
                data: pullers,
                hidden: true,
            }
        ]
    }
    return dataobj
}


// old FIREBASE version
// export function getEloHistory(playerData){
//     const elos = []
//     const timestamps = []
//     const elogain = [0]

//     for (const [gameid, game] of Object.entries(playerData)){
//         // ret.push([new Date(game.timestamp), game.elo])
//         const intGameId = parseInt(gameid)
//         const ts = new Date(game.timestamp)
//         elos.push([intGameId, game.elo])
//         timestamps.push([intGameId, `${ts.getMonth()+1}/${ts.getDate()}/${ts.getFullYear()}`])
//     }
//     elos.sort(sortListByGameID)

//     for (let i = 1; i < elos.length; i++){
//         elogain.push([elos[i][0], elos[i][1] - elos[i-1][1]])
//     }

//     return [elos, timestamps, elogain]
// }

export function getEloHistory(playerdata, playeruid){
    const data = []
    for (const game of playerdata){
        let jsonstr = null
        switch(playeruid) {
            case game['winner1']:
                jsonstr = game['winner1data']
                break;
            case game['winner2']:
                jsonstr = game['winner2data']
                break;
            case game['winner3']:
                jsonstr = game['winner3data']
                break;
            case game['loser1']:
                jsonstr = game['loser1data']
                break;
            case game['loser2']:
                jsonstr = game['loser2data']
                break;
            case game['loser3']:
                jsonstr = game['loser3data']
                break;
        }  
        const json = JSON.parse(jsonstr)
        if (json==null){
            alert('json null')
        }
        const ts = new Date(game['timestamp'])
        json['timestamp'] = `${ts.getMonth()+1}/${ts.getDate()}/${ts.getFullYear()}`
        data.push(json)
    }
    return data
}

export function createChartData(playerdata, uid, uidPlayerMap){
    if (playerdata.length == 0){
        return
    }
    const justPlayerData = getEloHistory(playerdata, uid)
    const mostRecentGame = justPlayerData[0]

    const elos = []
    const timestamps = []
    const elogain = []
    const gameWinners = []
    const gameLosers = []
    const pullers = []
    for (let i = justPlayerData.length - 1; i >= 0; i--){
        elos.push(justPlayerData[i].newElo)
        timestamps.push(justPlayerData[i].timestamp)
        elogain.push(justPlayerData[i].newElo - justPlayerData[i].oldElo)
        gameWinners.push([uidPlayerMap[playerdata[i]['winner1']], uidPlayerMap[playerdata[i]['winner2']], uidPlayerMap[playerdata[i]['winner3']]])
        gameLosers.push([uidPlayerMap[playerdata[i]['loser1']], uidPlayerMap[playerdata[i]['loser2']], uidPlayerMap[playerdata[i]['loser3']]])
        pullers.push(playerdata[i].winnerPulled)
    }

    const chartData = formatChartData(elos, timestamps, elogain, gameWinners, gameLosers, pullers)        
    
    return [chartData, mostRecentGame]
}