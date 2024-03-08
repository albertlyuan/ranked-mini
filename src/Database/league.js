import { generateClient } from "aws-amplify/api";
import { updateLeague, createLeague, deleteLeague } from '../graphql/mutations.js';
import { listLeagues, getLeague } from "../graphql/queries.js";

const client = generateClient()

export async function aws_createLeague(leaguename, adminUID){
    const newLeague = await client.graphql({
        query: createLeague,
        variables: {
            input: {
            "players": [],
            "games": [],
            "leagueName": leaguename,
            "adminUID": adminUID,
            "breaks": ""
        }
        }
    });
}


export async function aws_updateLeagueBreaks(leagueid, breaks){
    const updatedLeague = await client.graphql({
        query: updateLeague,
        variables: {
            input: {
            "id": leagueid,
            "breaks": breaks
        }
        }
    });
}

export async function aws_updateLeaguename(leagueid, leaguename){
    const updatedLeague = await client.graphql({
        query: updateLeague,
        variables: {
            input: {
            "id": leagueid,
            "leagueName": leaguename
        }
        }
    });
}

export async function aws_deleteLeague(leagueid){
    const deletedGame = await client.graphql({
        query: deleteLeague,
        variables: {
            input: {
                id: leagueid
            }
        }
    });
}

export async function aws_getAllLeagues(){
    // List all items
    const allLeagues = await client.graphql({
        query: listLeagues
    });
    return allLeagues
}

export async function aws_getLeague(leagueid){
    // Get a specific item
    try{
        if (leagueid == null){
            return
        }
        const oneLeague = await client.graphql({
            query: getLeague,
            variables: { id: leagueid }
        });
        return oneLeague
    }catch(error){
        console.log(error)
        // alert('getleague')
        alert(error)
    }
}

export async function aws_listAdminLeagues(adminuid){
    try{
        const allLeagues = await client.graphql({
            query: listLeagues,
            variables: { filter: { adminUID: { eq: adminuid } } }
        });
        return allLeagues
    }catch(error){
        alert('listadminleagues')
    }
}
