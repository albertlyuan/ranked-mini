### npm commands

- run `./deploy` to build and publish the site to the server
- run `npm start` to run a local server for development

### test files
- `node src/stats.js` - prints top gainers and break2win rate
- `node src/inportjson.js` - reenters games (for when incorrect input or elo alg changes) (need to change realtime db write permissions)

Run 'amplify pull' to sync future upstream changes.
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources 