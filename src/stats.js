import * as firebase from './Firebase/database.js'
import * as elo from './Elo/elo.js'


async function WeeklyRisers(){
    const baseurl = "https://ranked-mini-default-rtdb.firebaseio.com/"
    let lastweek = new Date()
    lastweek.setDate(lastweek.getDate()-7)

    console.log(lastweek.toString())

    let query = `games.json?orderBy="timestamp"&startAt="${lastweek}"`
    //need to reformat all dates to be mm/dd/yyyy hh/mm/ss
    console.log(baseurl+query)
    firebase.queryDB(baseurl+query).then(x=>{
        console.log(x)
    })
}
WeeklyRisers()