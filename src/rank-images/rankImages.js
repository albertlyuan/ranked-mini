import Unranked from "./Unranked.webp"
import Bronze1 from "./Bronze 1.webp"
import Bronze2 from "./Bronze 2.webp"
import Bronze3 from "./Bronze 3.webp"
import Silver1 from "./Silver 1.webp"
import Silver2 from "./Silver 2.webp"
import Silver3 from "./Silver 3.webp"
import Gold1 from "./Gold 1.webp"
import Gold2 from "./Gold 2.webp"
import Gold3 from "./Gold 3.webp"
import Platinum1 from "./Platinum 1.webp"
import Platinum2 from "./Platinum 2.webp"
import Platinum3 from "./Platinum 3.webp"
import Diamond1 from "./Diamond 1.webp"
import Diamond2 from "./Diamond 2.webp"
import Diamond3 from "./Diamond 3.webp"
import Champion1 from "./Champion 1.webp"
import Champion2 from "./Champion 2.webp"
import Champion3 from "./Champion 3.webp"
import GrandChampion from "./Grand Champion.png"


const ranks = [
    [Unranked,null],
    [Bronze1,150],
    [Bronze2,200],
    [Bronze3,250],
    [Silver1,300],
    [Silver2,350],
    [Silver3,400],
    [Gold1,450],
    [Gold2,500],
    [Gold3,550],
    [Platinum1,600],
    [Platinum2,650],
    [Platinum3,700],
    [Diamond1,750],
    [Diamond2,800],
    [Diamond3,850],
    [Champion1,900],
    [Champion2,950],
    [Champion3,1000],
    [GrandChampion, null]
]

function getRankFromElo(elo, wins, losses){
    if (wins + losses < 10){
        return Unranked
    } 
    for (const [rankImg, threshold] of ranks){
        if (!threshold){
            continue
        }
        if (elo < threshold){
            return rankImg
        }
    }
    return GrandChampion

}

export {getRankFromElo, ranks}