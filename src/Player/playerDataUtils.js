import { blankPlayer } from "../Firebase/database.js"

export function makeCroppedChartData(chartData, numPlacements){
    const data = {
        labels: chartData.labels.slice(numPlacements),
        datasets: [
        {
            label: "Elo",
            data: chartData.datasets[0].data.slice(numPlacements),
            backgroundColor: "black",
            borderColor:"black",
            borderWidth: 2
        },
        {
            label: "timestamps",
            data: chartData.datasets[1].data.slice(numPlacements),
            hidden: true
        },
        {
            label: "elogain",
            data: chartData.datasets[2].data.slice(numPlacements),
            hidden: true
        },
        {
            label: "winners",
            data: chartData.datasets[3].data.slice(numPlacements),
            hidden: true
        },
        {
            label: "losers",
            data: chartData.datasets[4].data.slice(numPlacements),
            hidden: true
        },
        {
            label: "pulled",
            data: chartData.datasets[5].data.slice(numPlacements),
            hidden: true
        }, 
        ]
    }
    data.datasets[2].data[0] = 0
    return data
}

export function createChartData(elos, timestamps, elogain, gameWinners, gameLosers, pullers){
    const dataobj = {
        labels: elos.map(x => x[0]),
        datasets: [
            {
                label: "Elo",
                data: elos.map(x => x[1]),
                backgroundColor: "black",
                borderColor:"black",
                borderWidth: 2
            },
            {
                label: "timestamps",
                data: timestamps.map(x => x[1]),
                hidden: true,
            },
            {
                label: "elogain",
                data: elogain.map(x => x[1]),
                hidden: true,
            },
            {
                label: "winners",
                data: gameWinners.map(x => x[1]),
                hidden: true,
            },
            {
                label: "losers",
                data: gameLosers.map(x => x[1]),
                hidden: true,
            },
            {
                label: "pulled",
                data: pullers.map(x => x[1]),
                hidden: true,
            }
        ]
    }
    return dataobj
}

export function getMostRecentGame(playerData){
    if (!playerData){
        return
    }
    let gameIDs = Object.keys(playerData)
    if (gameIDs.length < 1){
        return blankPlayer("")
    }
    let maxGameID = Math.max.apply(0,gameIDs)

    return playerData[maxGameID]
}

export function sortListByGameID(a,b){
    if (a[0] < b[0]) {
        return -1;
    } else if (a[0] > b[0]) {
        return 1;
    } else {
        return 0;
    }
}

export function getGamePlayers(playerGames){
    const gameWinners = [[-1,null]]
    const gameLosers = [[-1,null]]
    const pullers = [[-1,null]]
    
    for (const g of playerGames){
        const intGameId = parseInt(g[0])
        gameWinners.push([intGameId,g[2]])
        gameLosers.push([intGameId,g[3]])
        pullers.push([intGameId,g[4]])
    }
    gameLosers.sort(sortListByGameID)
    gameWinners.sort(sortListByGameID)
    pullers.sort(sortListByGameID)

    return [gameWinners, gameLosers, pullers]
}

export function getEloHistory(playerData){
    const elos = []
    const timestamps = []
    const elogain = [0]

    for (const [gameid, game] of Object.entries(playerData)){
        // ret.push([new Date(game.timestamp), game.elo])
        const intGameId = parseInt(gameid)
        const ts = new Date(game.timestamp)
        elos.push([intGameId, game.elo])
        timestamps.push([intGameId, `${ts.getMonth()+1}/${ts.getDate()}/${ts.getFullYear()}`])
    }
    elos.sort(sortListByGameID)

    for (let i = 1; i < elos.length; i++){
        elogain.push([elos[i][0], elos[i][1] - elos[i-1][1]])
    }

    return [elos, timestamps, elogain]
}