const fakeData = [
    ['a',400],
    ['b',500],
    ['c',1000]
]

function startup(){
    buildLeaderboard()
}


function buildLeaderboard(){
    const leaderboard = document.getElementById("leaderboard");

    const table = document.createElement("table")
   
    for (const [idx, player] of fakeData.entries()){
        const playerRow = table.insertRow()
        // let position = "·";
        // let score = "--";
        // let color = "#bbb"

        // if (player[1] != null){
        // let position = `${idx + 1}`;
        let elo = `${player[1]}`;
        let color = "black"
        // }

        // const positionCol = playerRow.insertCell()
        // positionCol.appendChild(document.createTextNode(position))

        const nameCol = playerRow.insertCell()
        nameCol.appendChild(document.createTextNode(player[0]))

        const eloCol = playerRow.insertCell()
        eloCol.appendChild(document.createTextNode(elo))
        eloCol.style.textAlign = "right"

        playerRow.style.color = color

    }
    leaderboard.appendChild(table)
}


function goToIndex() {
    window.location.href = "index.html";
}

function goToFAQ() {
    window.location.href = "faq.html";
}

function goToReport() {
    window.location.href = "reportscore.html";
}