import * as fs from 'fs'
import path from 'path';
import { firebase_loadTest } from '../Firebase/database.js';

export const TESTDB = "KTADcHMg24fTPi7MD9HBu0lZIzx2"
export const TEST_ROSTER = [
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
  
export async function resetDB(){
    // await firebase_loadTest(TESTDB,TEST_ROSTER)
    fs.readFile(path.dirname(__filename)+"/testData12.json", 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading the file:', err);
          return;
      }
      // Parse the JSON data
      try {
          const jsonData = JSON.parse(data);
          firebase_loadTest(TESTDB,jsonData)
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
      }
    });
  }