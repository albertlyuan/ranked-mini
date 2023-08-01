import { RankTable } from "./rankTable.js";
import { CalculatingElo } from "./calculatingElo.js";

export default function FAQ(){
    
    return(
        <div class="animatedLoad">

            <CalculatingElo/>

            <br></br>

            <RankTable/>

        </div>
    );
}