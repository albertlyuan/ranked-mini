import { RankTable } from "./rankTable.js";
import { CalculatingElo } from "./calculatingElo.js";

export default function FAQ(){
    
    return(
        <div class="animatedLoad">

            <h2>Calculating Elo</h2>
            <CalculatingElo/>

            <br></br>

            <h2>Ranks</h2>
            <RankTable/>

        </div>
    );
}