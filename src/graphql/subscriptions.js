/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onCreatePlayer(filter: $filter) {
      id
      elo
      wins
      losses
      leagueID
      displayName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onUpdatePlayer(filter: $filter) {
      id
      elo
      wins
      losses
      leagueID
      displayName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onDeletePlayer(filter: $filter) {
      id
      elo
      wins
      losses
      leagueID
      displayName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame($filter: ModelSubscriptionGameFilterInput) {
    onCreateGame(filter: $filter) {
      id
      timestamp
      loser1data
      loser2data
      loser3data
      winner1data
      winner2data
      winner3data
      winnerPulled
      pullfactor
      leagueID
      loser1
      loser2
      loser3
      winner1
      winner2
      winner3
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame($filter: ModelSubscriptionGameFilterInput) {
    onUpdateGame(filter: $filter) {
      id
      timestamp
      loser1data
      loser2data
      loser3data
      winner1data
      winner2data
      winner3data
      winnerPulled
      pullfactor
      leagueID
      loser1
      loser2
      loser3
      winner1
      winner2
      winner3
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame($filter: ModelSubscriptionGameFilterInput) {
    onDeleteGame(filter: $filter) {
      id
      timestamp
      loser1data
      loser2data
      loser3data
      winner1data
      winner2data
      winner3data
      winnerPulled
      pullfactor
      leagueID
      loser1
      loser2
      loser3
      winner1
      winner2
      winner3
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateLeague = /* GraphQL */ `
  subscription OnCreateLeague($filter: ModelSubscriptionLeagueFilterInput) {
    onCreateLeague(filter: $filter) {
      id
      players {
        nextToken
        __typename
      }
      games {
        nextToken
        __typename
      }
      leagueName
      adminUID
      breaks
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateLeague = /* GraphQL */ `
  subscription OnUpdateLeague($filter: ModelSubscriptionLeagueFilterInput) {
    onUpdateLeague(filter: $filter) {
      id
      players {
        nextToken
        __typename
      }
      games {
        nextToken
        __typename
      }
      leagueName
      adminUID
      breaks
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteLeague = /* GraphQL */ `
  subscription OnDeleteLeague($filter: ModelSubscriptionLeagueFilterInput) {
    onDeleteLeague(filter: $filter) {
      id
      players {
        nextToken
        __typename
      }
      games {
        nextToken
        __typename
      }
      leagueName
      adminUID
      breaks
      createdAt
      updatedAt
      __typename
    }
  }
`;
