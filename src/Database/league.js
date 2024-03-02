import { generateClient } from "aws-amplify/api";
import { updateLeague, createLeague, deleteLeague } from '../graphql/mutations.js';
import { listLeagues, getLeague } from "../graphql/queries.js";

const client = generateClient()

export async function createLeague_wrapper(leaguename, adminUID){
    const newLeague = await client.graphql({
        query: createLeague,
        variables: {
            input: {
            "players": [],
            "games": [],
            "leagueName": leaguename,
            "adminUID": adminUID
        }
        }
    });
}
export async function updateLeague_wrapper(leaguename, adminUID){
    const updatedLeague = await client.graphql({
        query: updateLeague,
        variables: {
            input: {
            "players": [],
            "games": [],
            "leagueName": leaguename,
            "adminUID": adminUID
        }
        }
    });
}

export async function deleteLeague_wrapper(leagueid){
    const deletedGame = await client.graphql({
        query: deleteLeague,
        variables: {
            input: {
                id: leagueid
            }
        }
    });
}

export async function getAllLeagues_wrapper(){
    // List all items
    const allLeagues = await client.graphql({
        query: listLeagues
    });
    return allLeagues
}

export async function getLeague_wrapper(leagueid){
    // Get a specific item
    const oneLeague = await client.graphql({
        query: getLeague,
        variables: { id: leagueid }
    });
    return oneLeague
}

export async function listAdminLeagues(adminuid){
    const allLeagues = await client.graphql({
        query: listLeagues,
        variables: { filter: { adminUID: { eq: adminuid } } }
    });
    return allLeagues
}

