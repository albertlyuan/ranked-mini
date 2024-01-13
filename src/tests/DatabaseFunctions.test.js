import { firebase_getPlayers, queryGamePlayersData, firebase_logNewGame, firebase_addNewPlayer, getUIDFromName, firebase_getTotalPlayerData } from '../Firebase/database';

import { TESTDB, TEST_ROSTER, resetDB } from './TestUtils.js';

test('break and hold game', async () => {
  await resetDB()
  const [playernames, _] = await firebase_getPlayers(TESTDB)
  expect(playernames.length).toBeGreaterThanOrEqual(TEST_ROSTER.length)
  await firebase_logNewGame(TESTDB,'p1','p2','p3','p4','p5','p6',true,false)
  await firebase_logNewGame(TESTDB,'p7','p8','p9','p10','p11','p12',false,false)
  setTimeout(()=>{console.log("Saving...")}, 2000)

  const breakwin = 513.0046654728586
  const breaklose = 298.74379612190205
  let breakwin_winners = await queryGamePlayersData(TESTDB,['p1','p2','p3'],0)
  let breakwin_losers = await queryGamePlayersData(TESTDB,['p4','p5','p6'],0)

  const holdwin = 454.9656717897381
  const holdlose = 390.9656717897381 
  let holdwin_winners = await queryGamePlayersData(TESTDB,['p7','p8','p9'],1)
  let holdwin_losers = await queryGamePlayersData(TESTDB,['p10','p11','p12'],1)
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

test("add player", async ()=>{
  const testName = "testnewplayer1"
  await firebase_addNewPlayer(TESTDB,testName)
  const uid = await getUIDFromName(TESTDB,testName)
  const player_data = await firebase_getTotalPlayerData(TESTDB, uid)
  
  expect(player_data[-1] != null)
  expect(player_data[-1]['elo'] == 400)
  expect(player_data[-1]['game_id'] == -1)
  expect(player_data[-1]['losses'] == 400)
  expect(player_data[-1]['wins'] == 0)
  expect(player_data[-1]['name'] == uid)
})