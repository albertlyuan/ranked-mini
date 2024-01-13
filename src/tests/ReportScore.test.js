import React from 'react';
import { render, fireEvent, screen} from '@testing-library/react';
import ReportScore from '../ReportScore/reportscore';
import { firebase_logNewGame } from '../Firebase/database';
import { MemoryRouter, Route, Routes} from 'react-router-dom';
import { TESTDB } from './TestUtils';

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

jest.mock('../Firebase/database', () => ({
  firebase_logNewGame: jest.fn()
}));

function renderReportScore(){
  const setLeagueid = jest.fn()
  const updater = jest.fn()

  const {debug} = render(
  <MemoryRouter initialEntries={[`/${TESTDB}/reportscore`]} initialIndex={0}>
    <Routes>
    <Route 
      path="/:leagueid/reportscore" 
      element={<ReportScore roster={TEST_ROSTER} updater={updater} setLeagueid={setLeagueid}/>} 
    />
    </Routes>
  </MemoryRouter>
  )
  return debug
}

test("Inputs Work", () =>{
  const debug = renderReportScore()

  fireEvent.click(screen.getByTestId('winner1').querySelector('.dropbtn'))
  expect(screen.queryByText('p1')).toBeInTheDocument();
  expect(screen.queryByText('p2')).toBeInTheDocument();
  expect(screen.queryByText('p3')).toBeInTheDocument();
  expect(screen.queryByText('p4')).toBeInTheDocument();
  expect(screen.queryByText('p5')).toBeInTheDocument();
  expect(screen.queryByText('p6')).toBeInTheDocument();
  fireEvent.click(screen.queryByText('p1'));


  fireEvent.click(screen.getByTestId('winner2').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p2'));

  fireEvent.click(screen.getByTestId('winner3').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p3'));

  fireEvent.click(screen.getByTestId('loser1').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p4'));

  fireEvent.click(screen.getByTestId('loser2').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p5'));

  fireEvent.click(screen.getByTestId('loser3').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p6'));

  expect(screen.queryByTestId("pullSelector"))
  fireEvent.click(screen.queryByTestId('winpuller'));
  expect(screen.queryByTestId("submitButton"))
  fireEvent.submit(screen.queryByTestId('submitButton'));

  expect(firebase_logNewGame).toBeCalledWith(TESTDB,'p1','p2','p3','p4','p5','p6',true,true);
})


test("Swap Players", () =>{
  const debug = renderReportScore()

  fireEvent.click(screen.getByTestId('winner1').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p1'));

  fireEvent.click(screen.getByTestId('winner2').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p2'));

  fireEvent.click(screen.getByTestId('winner3').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p3'));

  fireEvent.click(screen.getByTestId('loser1').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p4'));

  fireEvent.click(screen.getByTestId('loser2').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p5'));

  fireEvent.click(screen.getByTestId('loser3').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p6'));

  fireEvent.click(screen.queryByTestId('swapButton'));

  expect(screen.queryByTestId("pullSelector"))
  fireEvent.click(screen.queryByTestId('winpuller'));

  expect(screen.queryByTestId("submitButton"))
  fireEvent.submit(screen.queryByTestId('submitButton'));

  expect(firebase_logNewGame).toBeCalledWith(TESTDB,'p4','p5','p6','p1','p2','p3',true,true);
})

test("Clear Players", () =>{
  const debug = renderReportScore()
  
  fireEvent.click(screen.getByTestId('winner1').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p1'));

  fireEvent.click(screen.getByTestId('winner2').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p2'));

  fireEvent.click(screen.getByTestId('winner3').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p3'));

  fireEvent.click(screen.getByTestId('loser1').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p4'));

  fireEvent.click(screen.getByTestId('loser2').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p5'));

  fireEvent.click(screen.getByTestId('loser3').querySelector('.dropbtn'))
  fireEvent.click(screen.queryByText('p6'));

  fireEvent.click(screen.queryByTestId('swapButton'));

  expect(screen.queryByTestId("pullSelector"))
  fireEvent.click(screen.queryByTestId('winpuller'));

  expect(screen.queryByTestId("clearButton"))
  fireEvent.click(screen.queryByTestId('clearButton'));

  expect(screen.queryByTestId("submitButton")).not.toBeInTheDocument()
  expect(screen.queryByTestId("pullSelector")).not.toBeInTheDocument()
  expect(screen.queryByText('p1')).not.toBeInTheDocument();
  expect(screen.queryByText('p2')).not.toBeInTheDocument();
  expect(screen.queryByText('p3')).not.toBeInTheDocument();
  expect(screen.queryByText('p4')).not.toBeInTheDocument();
  expect(screen.queryByText('p5')).not.toBeInTheDocument();
  expect(screen.queryByText('p6')).not.toBeInTheDocument();

})