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
      PlayerHistories {
        nextToken
        __typename
      }
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
      PlayerHistories {
        nextToken
        __typename
      }
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
      PlayerHistories {
        nextToken
        __typename
      }
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
      loser1
      loser2
      loser3
      winner1
      winner2
      winner3
      winnerPulled
      leagueID
      PlayerHistories {
        nextToken
        __typename
      }
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
      loser1
      loser2
      loser3
      winner1
      winner2
      winner3
      winnerPulled
      leagueID
      PlayerHistories {
        nextToken
        __typename
      }
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
      loser1
      loser2
      loser3
      winner1
      winner2
      winner3
      winnerPulled
      leagueID
      PlayerHistories {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreatePlayerHistory = /* GraphQL */ `
  subscription OnCreatePlayerHistory(
    $filter: ModelSubscriptionPlayerHistoryFilterInput
  ) {
    onCreatePlayerHistory(filter: $filter) {
      id
      elo
      wins
      losses
      timestamp
      playerID
      gameID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePlayerHistory = /* GraphQL */ `
  subscription OnUpdatePlayerHistory(
    $filter: ModelSubscriptionPlayerHistoryFilterInput
  ) {
    onUpdatePlayerHistory(filter: $filter) {
      id
      elo
      wins
      losses
      timestamp
      playerID
      gameID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeletePlayerHistory = /* GraphQL */ `
  subscription OnDeletePlayerHistory(
    $filter: ModelSubscriptionPlayerHistoryFilterInput
  ) {
    onDeletePlayerHistory(filter: $filter) {
      id
      elo
      wins
      losses
      timestamp
      playerID
      gameID
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
