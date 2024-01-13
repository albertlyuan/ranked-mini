export default function PullSelector({setDidSetPuller, winnerPulled, setWinnerPulled}){

    function clickWinner(){
        setWinnerPulled(true)
        setDidSetPuller(true)
    }

    function clickLoser(){
        setWinnerPulled(false)
        setDidSetPuller(true)
    }

    return (
        <table >
            <tr style={{textAlign: "center"}}>
                {/* elogain just to get green color */}
                <td class={(winnerPulled===true ? "elogain" : "") + " clickable highlights"} onClick={clickWinner} data-testid="winpuller">
                    <a >
                        Pulled
                    </a>
                </td>
                <td class={(winnerPulled===false ? "elogain" : "") + " clickable highlights"} onClick={clickLoser} data-testid="losepuller">
                    <a>
                        Pulled
                    </a>
                </td>
            </tr>
        </table>
    )
}

