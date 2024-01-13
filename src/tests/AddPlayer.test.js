import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddPlayer from '../Leaderboard/addPlayer';
import { getUIDFromName, firebase_getTotalPlayerData, firebase_addNewPlayer } from '../Firebase/database';

import { TESTDB } from './TestUtils';

test('Add empty player name', () => {
    const roster = []
    const setStatusMsg = jest.fn();

    const { getByTestId } = render(<AddPlayer setStatusMsgFunc={setStatusMsg} roster={roster}/>);
    
    fireEvent.change(getByTestId('AddNewPlayerBox'), { target: { value: '   ' } });
    fireEvent.submit(getByTestId('AddNewPlayerBox'))
    expect(setStatusMsg).toHaveBeenCalledWith('name cannot be empty');
});

test('Add existing player name', () =>{

    const roster = [['existingPlayer', -400, 0, 0, ['teams']]]
    const setStatusMsg = jest.fn();

    const { getByTestId } = render(<AddPlayer setStatusMsgFunc={setStatusMsg} roster={roster}/>);
    
    fireEvent.change(getByTestId('AddNewPlayerBox'), { target: { value: 'existingPlayer' } });
    fireEvent.submit(getByTestId('AddNewPlayerBox'))
    expect(setStatusMsg).toHaveBeenCalledWith('name already exists');

    fireEvent.change(getByTestId('AddNewPlayerBox'), { target: { value: ' existingPlayer ' } });
    fireEvent.submit(getByTestId('AddNewPlayerBox'))
    expect(setStatusMsg).toHaveBeenCalledWith('name already exists');
})

jest.mock('../Firebase/database', () => ({
  firebase_addNewPlayer: jest.fn()
}));

test('Successful add player', async () =>{
  const testName = "testnewplayer1"
  const roster = []
  const setStatusMsg = jest.fn();
  
  const { getByTestId } = render(<AddPlayer setStatusMsgFunc={setStatusMsg} roster={roster} leagueid={TESTDB}/>);

  fireEvent.change(getByTestId('AddNewPlayerBox'), { target: { value: testName } });
  fireEvent.submit(getByTestId('AddNewPlayerBox'))
  expect(firebase_addNewPlayer).toBeCalledWith(TESTDB,testName);
})