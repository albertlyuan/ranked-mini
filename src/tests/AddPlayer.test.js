import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddPlayer from '../Leaderboard/addPlayer';
import { getUIDFromName, firebase_getTotalPlayerData } from '../Firebase/database';

const TESTDB_NAME = "test"

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

test('Successful add player', async () =>{
  const testName = "testnewplayer1"
  const roster = []
  const setStatusMsg = jest.fn();

  const { getByTestId } = render(<AddPlayer setStatusMsgFunc={setStatusMsg} roster={roster} leagueid={TESTDB_NAME}/>);

  fireEvent.change(getByTestId('AddNewPlayerBox'), { target: { value: testName } });
  fireEvent.submit(getByTestId('AddNewPlayerBox'))

  const uid = await getUIDFromName(TESTDB_NAME,testName)
  const player_data = await firebase_getTotalPlayerData(TESTDB_NAME, uid)
  
  expect(player_data[-1] != null)
  expect(player_data[-1]['elo'] == 400)
  expect(player_data[-1]['game_id'] == -1)
  expect(player_data[-1]['losses'] == 400)
  expect(player_data[-1]['wins'] == 0)
  expect(player_data[-1]['name'] == uid)
})