export {STARTING_ELO, calculateNewElo, calculateTeamElo, expectedValue}

//
const STARTING_ELO = 0
const PULL_FACTOR = 0.298701299
//data shows 7/30 = 0.23 times break
//.23/.77 = 0.298701299 = expected win 

//amount of elo to gain/lose per game
const NormalK = 32
const UnrankedK = 32

//amount of elo diff for 10x odds
const D = 400

//weighted elo for team elo
const L = 200 //max amount of weight
const slope = 0.005
const midpoint = 400


/**
 * Calculated new player Elo using equation:
 * 
 * oldElo + K*(1- (1/ (1+10^((oppoElo - oldElo)/D) ) ) ) 
 * 
 * Currently K=32 D=400
 * @param {float} oldPlayerElo
 * @param {float} winningTeamElo 
 * @param {float} losingTeamElo 
 * @param {boolean} win_boolean 
 * @returns 
 */
function calculateNewElo(oldPlayerElo, winningTeamElo, losingTeamElo, win_boolean, totalGames, winner_pulled){
    let k = NormalK
    if (totalGames < 10){
        k = UnrankedK
    }
    let ret = 0
    if (win_boolean){ //win
        if (winner_pulled){ //player won and pulled
            ret = oldPlayerElo + k*(1-expectedValue(oldPlayerElo,losingTeamElo, win_boolean, winner_pulled)) / PULL_FACTOR
            console.log("Won + pulled")
        }else{ //player won and received
            ret = oldPlayerElo + k*(1-expectedValue(oldPlayerElo,losingTeamElo, win_boolean, winner_pulled)) / (1-PULL_FACTOR)
            console.log("Won + received")
        }
        console.log(oldPlayerElo,losingTeamElo)

    }else{ //lost
        const player_team_elo = Math.min(oldPlayerElo,losingTeamElo)
        if (winner_pulled){ //player lost and received
            ret = Math.max(0,oldPlayerElo + k*(0-expectedValue(player_team_elo,winningTeamElo, win_boolean, winner_pulled)) * (1-PULL_FACTOR)) 
            console.log("lost + received")
        }else{ //player lost and pulled
            ret = Math.max(0,oldPlayerElo + k*(0-expectedValue(player_team_elo,winningTeamElo, win_boolean, winner_pulled)) * PULL_FACTOR) 
            console.log("lost + pulled")
        }
        console.log(player_team_elo, winningTeamElo)

    }
    return ret
}


/**
 * helper func for calclulating new elo
 * 
 * equation: 1/ (1+10^((oppoElo - oldElo)/D) )
 * @param {float} oldPlayerElo 
 * @param {float} opponentElo 
 * @returns expected win between 1(win) and 0(loss)
 */
function expectedValue(oldPlayerElo, opponentElo){
    return 1/(1+10**((opponentElo-oldPlayerElo)/D))
}


/**
 * calculates team elo. higher ranked players get weighted more heavily using equation: 
 * 
 * L / (1+ Math.E**(-slope*(elo-midpoint)))
 * 
 * L = 200 max weight
 * const slope = 0.005
 * const midpoint = 850 elo to get 100 weight

 * @param {list} team - list of player objects 
 * @returns float - team elo 
 */
function calculateTeamElo(team){
    const weightedRank = (elo) => {
        // return elo
        return elo + L / (1+ Math.E**(-slope*(elo-midpoint)))
    }

    const p1 = team[0].elo
    const p2 = team[1].elo
    const p3 = team[2].elo

    const teamElo = (weightedRank(p1) + weightedRank(p2) + weightedRank(p3)) / 3
    return teamElo
}