import React, { useState } from 'react';

export function SelectTeam({teamname, teamfilter, setTeamFilter}){
    function toggleFilter(){
        if (teamfilter === teamname){
            setTeamFilter('')
        }else{
            setTeamFilter(teamname)
        }

    }

    return (
        <button onClick={toggleFilter} style={{backgroundColor: teamfilter === teamname ? "#bbb" : "inherit"}}>
            <p>{teamname}</p>
        </button>
    )
}
