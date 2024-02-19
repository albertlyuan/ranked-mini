import Unranked from "./Unranked.webp"
import Bronze1 from "./Bronze1.webp"
import Bronze2 from "./Bronze2.webp"
import Bronze3 from "./Bronze3.webp"
import Silver1 from "./Silver1.webp"
import Silver2 from "./Silver2.webp"
import Silver3 from "./Silver3.webp"
import Gold1 from "./Gold1.webp"
import Gold2 from "./Gold2.webp"
import Gold3 from "./Gold3.webp"
import Platinum1 from "./Platinum1.webp"
import Platinum2 from "./Platinum2.webp"
import Platinum3 from "./Platinum3.webp"
import Diamond1 from "./Diamond1.webp"
import Diamond2 from "./Diamond2.webp"
import Diamond3 from "./Diamond3.webp"
import Champion1 from "./Champion1.webp"
import Champion2 from "./Champion2.webp"
import Champion3 from "./Champion3.webp"
import GrandChampion from "./GrandChampion.png"


export const ranks = [
    [Unranked,"Unranked",null],
    [Bronze1,"Bronze 1",150],
    [Bronze2,"Bronze 2",200],
    [Bronze3,"Bronze 3",250],
    [Silver1,"Silver 1",300],
    [Silver2,"Silver 2",350],
    [Silver3,"Silver 3",400],
    [Gold1,"Gold 1",450],
    [Gold2,"Gold 2",500],
    [Gold3,"Gold 3",550],
    [Platinum1,"Platinum 1",600],
    [Platinum2,"Platinum 2",650],
    [Platinum3,"Platinum 3",700],
    [Diamond1,"Diamond 1",750],
    [Diamond2,"Diamond 2",800],
    [Diamond3,"Diamond 3",850],
    [Champion1,"Champion 1",900],
    [Champion2,"Champion 2",950],
    [Champion3,"Champion 3",1000],
    [GrandChampion,"Grand Champion", null]
]
      
// getRankFromElo(before_elo, wins, losses).split("static/media/")[1].split(".")[0]} class="rankImg" src={getRankFromElo(before_elo, wins, losses)
export function getRankTitleFromElo(elo, wins, losses){
    if (wins + losses < 10){
        return ranks[0][1] //Unranked
    } 
    for (const [rankImg, rankTitle, threshold] of ranks){
        if (!threshold){
            continue
        }
        if (elo < threshold){
            return rankTitle
        }
    }
    return ranks[ranks.length-1][1] //Grand champion
}
export function getRankFromElo(elo, wins, losses){

    if (wins + losses < 10){
        return Unranked
    } 
    for (const [rankImg, rankTitle, threshold] of ranks){
        if (!threshold){
            continue
        }
        if (elo < threshold){
            return rankImg
        }
    }
    return GrandChampion

}

