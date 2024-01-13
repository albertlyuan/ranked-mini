import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { queryGamePlayersData } from '../Firebase/database';
import GameInfo from '../Game/gameInfo';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { TESTDB } from './TestUtils';

const TESTGAME = [0, new Date(), ['p1', 'p2', 'p3'], ['p4', 'p5', 'p6'], true]
const TESTNEXTGAME = [1, new Date(), ['p7', 'p8', 'p9'], ['p10', 'p11', 'p12'], false]

test('GameInfo', async () => {

    let winnerData = await queryGamePlayersData(TESTDB, ['p1', 'p2', 'p3'], 0)
    let loserData = await queryGamePlayersData(TESTDB, ['p4', 'p5', 'p6'], 0)
    console.log("Winnerdata",winnerData)
    const breakToWin = true
    const goToNextGame = jest.fn();
    const goToPrevGame = jest.fn();
    const { debug } = render(
        <MemoryRouter initialEntries={[`/${TESTDB}/games/0`]} initialIndex={0}>
            <Routes>
                <Route
                    path="/:leagueid/games/0"
                    element={
                        <GameInfo
                            game={TESTGAME}
                            nextgame={TESTNEXTGAME}
                            goToNextGame={goToNextGame}
                            goToPrevGame={goToPrevGame}
                            winnerData={winnerData}
                            loserData={loserData}
                            breakToWin={breakToWin}
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    )
    
    debug()
});
