import { firebase_getPlayers, firebase_loadTest, queryGamePlayersData, firebase_logNewGame } from '../Firebase/database';
import * as fs from 'fs'
import path from 'path';

const TESTDB_NAME = "test"
const TEST_ROSTER = [
  ['p1', -400, 0, 0, ['teams']],
  ['p2', -400, 0, 0, ['teams']],
  ['p3', -400, 0, 0, ['teams']],
  ['p4', -400, 0, 0, ['teams']],
  ['p5', -400, 0, 0, ['teams']],
  ['p6', -400, 0, 0, ['teams']],
  ['p7', -400, 0, 0, ['teams']],
  ['p8', -400, 0, 0, ['teams']],
  ['p9', -400, 0, 0, ['teams']],
  ['p10', -400, 0, 0, ['teams']],
  ['p11', -400, 0, 0, ['teams']],
  ['p12', -400, 0, 0, ['teams']],
]

async function resetDB(){
  // await firebase_loadTest(TESTDB_NAME,TEST_ROSTER)
  fs.readFile(path.dirname(__filename)+"/testData12.json", 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    // Parse the JSON data
    try {
        const jsonData = JSON.parse(data);
        firebase_loadTest(TESTDB_NAME,jsonData)
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
    }
});
}


test('break and hold game', async () => {
  await resetDB()
  const [playernames, _] = await firebase_getPlayers(TESTDB_NAME)
  expect(playernames.length).toEqual(TEST_ROSTER.length)
  await firebase_logNewGame(TESTDB_NAME,'p1','p2','p3','p4','p5','p6',true,true)
  await firebase_logNewGame(TESTDB_NAME,'p7','p8','p9','p10','p11','p12',false,true)
  setTimeout(()=>{console.log("Saving...")}, 2000)

  const breakwin = 513.0046654728586
  const breaklose = 298.74379612190205
  let breakwin_winners = await queryGamePlayersData(TESTDB_NAME,['p1','p2','p3'],0)
  let breakwin_losers = await queryGamePlayersData(TESTDB_NAME,['p4','p5','p6'],0)

  const holdwin = 454.9656717897381
  const holdlose = 390.9656717897381 
  let holdwin_winners = await queryGamePlayersData(TESTDB_NAME,['p7','p8','p9'],1)
  let holdwin_losers = await queryGamePlayersData(TESTDB_NAME,['p10','p11','p12'],1)
  setTimeout(()=>{console.log("Retrieving data...")}, 2000)

  for (const [pname, [startelo, endelo], [beforewins, beforelosses], [afterwins,afterlosses]] of breakwin_winners){
    expect(startelo).toEqual(400)
    expect(endelo).toEqual(breakwin)
    expect(afterwins).toEqual(1)
    expect(afterlosses).toEqual(0)
  }
  for (const [pname, [startelo, endelo], [beforewins, beforelosses], [afterwins,afterlosses]] of breakwin_losers){
    expect(startelo).toEqual(400)
    expect(endelo).toEqual(breaklose)
    expect(afterwins).toEqual(0)
    expect(afterlosses).toEqual(1)
  }
  for (const [pname, [startelo, endelo], [beforewins, beforelosses], [afterwins,afterlosses]] of holdwin_winners){
    expect(startelo).toEqual(400)
    expect(endelo).toEqual(holdwin)
    expect(afterwins).toEqual(1)
    expect(afterlosses).toEqual(0)
  }
  for (const [pname, [startelo, endelo], [beforewins, beforelosses], [afterwins,afterlosses]] of holdwin_losers){
    expect(startelo).toEqual(400)
    expect(endelo).toEqual(holdlose)
    expect(afterwins).toEqual(0)
    expect(afterlosses).toEqual(1)
  }
})