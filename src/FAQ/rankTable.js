import {ranks} from "../rank-images/rankImages.js"

function RankTable(){
    const rankMarkdown = ranks.toReversed().map((rank) => {
        const rankImg = rank[0]
        const rankThreshold = rank[1]
        if (rankThreshold){
        return(
            <tr>
                <td><img title={rankImg.split("static/media/")[1].split(".")[0]} class="rankImg" src={rankImg}></img></td>
                <td>{rankImg.split("static/media/")[1].split(".")[0]}</td>
                {rankThreshold > 150 ? <td>{rankThreshold-50}-{rankThreshold-1}</td> : <td>{"< "}{rankThreshold}</td>}
            </tr>
        )}
    })

    return (
        <table>
            <thead>
                <td></td>
                <td>Rank</td>
                <td>Elo Range</td>
            </thead>
            <tr>
                <td><img title={ranks[ranks.length-1][0].split("static/media/")[1].split(".")[0]} class="rankImg" src={ranks[ranks.length-1][0]}></img></td>
                <td>{ranks[ranks.length-1][0].split("static/media/")[1].split(".")[0]}</td>
                <td>{"> "}1000</td>
            </tr>
            {rankMarkdown}
            <tr>
                <td><img title={ranks[0][0].split("static/media/")[1].split(".")[0]} class="rankImg" src={ranks[0][0]}></img></td>
                <td>{ranks[0][0].split("static/media/")[1].split(".")[0]}</td>
                <td>-</td>
            </tr>
        </table>
    )
}

export {RankTable}