import { PULL_FACTOR } from "../Elo/elo.js"
export default function PullFactorSetter({dynamicPullFactor, toggleDynamicPullFactor}){

    function toggle(){
        toggleDynamicPullFactor(!dynamicPullFactor)
    }

    return (
        <table>
            <tr style={{textAlign: "center"}}>
                {/* elogain just to get green color */}
                <td class={(dynamicPullFactor===true ? "elogain" : "") + " clickable highlights"} onClick={toggle} >
                    <a >
                        Use Dynamic Pull Factor 
                    </a>
                </td>
                <td class={(dynamicPullFactor===false ? "elogain" : "") + " clickable highlights"} onClick={toggle}>
                    <a>
                        Use Default Pull Factor ({PULL_FACTOR})
                    </a>
                </td>
            </tr>
        </table>
    )
}

