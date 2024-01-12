import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { queryGamePlayersData } from '../Firebase/database';
import GameInfo from '../Game/gameInfo';
import { MemoryRouter } from 'react-router-dom';

const TESTDB_NAME = "test"
const TESTGAME = [0,new Date(), ['p1','p2','p3'],['p4','p5','p6'],true]
const TESTNEXTGAME = [1,new Date(), ['p7','p8','p9'],['p10','p11','p12'],false]

test('GameInfo', async () => {

    let winnerData = await queryGamePlayersData(TESTDB_NAME,['p1','p2','p3'],0)
    let loserData = await queryGamePlayersData(TESTDB_NAME,['p4','p5','p6'],0)
    const breakToWin = true
    const goToNextGame = jest.fn();
    const goToPrevGame = jest.fn();
    console.log(winnerData, loserData)
    // const {debug} = render(
    //   <MemoryRouter>
    //     <GameInfo 
    //       game={TESTGAME} 
    //       nextgame={TESTNEXTGAME}
    //       goToNextGame={goToNextGame} 
    //       goToPrevGame={goToPrevGame} 
    //       winnerData={winnerData}
    //       loserData={loserData}
    //       breakToWin={breakToWin}
    //     />
    //   </MemoryRouter>
    //   )
      
    // debug()
});
