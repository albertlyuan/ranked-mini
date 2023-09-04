
export function SelectTeam({teamname, teamfilter, setTeamFilter}){
    function toggleFilter(){
        if (teamfilter.toLowerCase() === teamname.toLowerCase()){
            setTeamFilter('')
        }else{
            setTeamFilter(teamname.toLowerCase())
        }

    }

    return (
        <button class="clickable highlights" onClick={toggleFilter} style={{backgroundColor: teamfilter === teamname ? "#bbb" : "inherit"}}>
            <p>{teamname}</p>
        </button>
    )
}
