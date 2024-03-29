
//
const STARTING_ELO = 400
// const PULL_FACTOR = 1
const PULL_FACTOR = 0.298701299

//data shows 7/30 = 0.23 games break
//.23/.77 = 0.298701299 times less likely to win if pull
//1/.29 = 3.34782608 times more elo gain/loss

// const PULL_FACTOR = 0.846153846
//if data shoes 0.458 games break
//.458/.542 = 0.846153846 times less likely to win if pull
//1/0.846153846 = 1.18181818 times more elo gain/loss

//amount of elo to gain/lose per game
const NormalK = 32
const UnrankedK = 64

//amount of elo diff for 10x odds
const D = 400

//weighted elo for team elo
const L = 200 //max amount of weight
const slope = 0.005
const midpoint = 850


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
function calculateNewElo(oldPlayerElo, winningTeamElo, losingTeamElo, win_boolean, totalGames, winner_pulled, pull_factor = PULL_FACTOR){
    // console.log("pull_factor",pull_factor)
    let k = NormalK
    if (totalGames < 10){
        k = UnrankedK
    }
    let ret = 0
    if (win_boolean){ //win
        if (winner_pulled){ //player won and pulled
            // console.log("brake",k*(1-expectedValue(oldPlayerElo,losingTeamElo, win_boolean, winner_pulled)))
            // console.log("multiplier",1/pull_factor)
            ret = oldPlayerElo + k*(1-expectedValue(oldPlayerElo,losingTeamElo, win_boolean, winner_pulled)) / pull_factor
        }else{ //player won and received
            // console.log("held",k*(1-expectedValue(oldPlayerElo,losingTeamElo, win_boolean, winner_pulled)))
            ret = oldPlayerElo + k*(1-expectedValue(oldPlayerElo,losingTeamElo, win_boolean, winner_pulled) / (1/pull_factor))
        }

    }else{ //lost
        const player_team_elo = Math.min(oldPlayerElo,losingTeamElo)

        if (winner_pulled){ //player lost and received
            // console.log("broken",k*(0-expectedValue(player_team_elo,winningTeamElo, win_boolean, winner_pulled)))
            // console.log("multiplier",1/(pull_factor))
            ret = Math.max(0,oldPlayerElo + k*(0-expectedValue(player_team_elo,winningTeamElo, win_boolean, winner_pulled)) / pull_factor) 
        }else{ //player lost and pulled
            // console.log("other team held",k*(0-expectedValue(player_team_elo,winningTeamElo, win_boolean, winner_pulled)))
            ret = Math.max(0,oldPlayerElo + k*(0-expectedValue(player_team_elo,winningTeamElo, win_boolean, winner_pulled)) / (1/pull_factor)) 
        }
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
 * calculates team elo. higher ranked players get weighted more 

 * @param {list} team - list of player objects 
 * @returns float - team elo 
 */
function calculateTeamElo(team){
    const p1 = team[0].elo
    const p2 = team[1].elo
    const p3 = team[2].elo

    const teamElo = (weightedRank(p1) + weightedRank(p2) + weightedRank(p3)) / 3
    return teamElo
}

/**
 * Logistically weighted elo 
 * 
 * L / (1+ Math.E**(-slope*(elo-midpoint)))
 * 
 * L = max weight
 * const slope 
 * const midpoint = elo to get L/2 weight
 * 
 * @param {float} elo 
 * @returns float
 */
function weightedRank(elo){
    // return elo
    return elo + L / (1+ Math.E**(-slope*(elo-midpoint)))
}

export {calculateNewElo, calculateTeamElo, weightedRank, STARTING_ELO, PULL_FACTOR, NormalK, UnrankedK,D,L,slope,midpoint}
