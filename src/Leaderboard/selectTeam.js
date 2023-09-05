
export function SelectTeam({teamname, teamfilter, setTeamFilter}){
    function toggleFilter(){
        if (teamfilter.toLowerCase() === teamname.toLowerCase()){
            setTeamFilter('')
        }else{
            setTeamFilter(teamname.toLowerCase())
        }

    }

    return (
        <button id="teambutton" onClick={toggleFilter} class={ teamfilter === teamname ? "teambutton_selected" : "teambutton_unselected"}>
            <p>{teamname}</p>
        </button>
    )
}
