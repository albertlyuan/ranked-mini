/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPlayer = /* GraphQL */ `
  mutation CreatePlayer(
    $input: CreatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    createPlayer(input: $input, condition: $condition) {
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
export const updatePlayer = /* GraphQL */ `
  mutation UpdatePlayer(
    $input: UpdatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    updatePlayer(input: $input, condition: $condition) {
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
export const deletePlayer = /* GraphQL */ `
  mutation DeletePlayer(
    $input: DeletePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    deletePlayer(input: $input, condition: $condition) {
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
export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
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
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
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
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
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
export const createPlayerHistory = /* GraphQL */ `
  mutation CreatePlayerHistory(
    $input: CreatePlayerHistoryInput!
    $condition: ModelPlayerHistoryConditionInput
  ) {
    createPlayerHistory(input: $input, condition: $condition) {
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
export const updatePlayerHistory = /* GraphQL */ `
  mutation UpdatePlayerHistory(
    $input: UpdatePlayerHistoryInput!
    $condition: ModelPlayerHistoryConditionInput
  ) {
    updatePlayerHistory(input: $input, condition: $condition) {
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
export const deletePlayerHistory = /* GraphQL */ `
  mutation DeletePlayerHistory(
    $input: DeletePlayerHistoryInput!
    $condition: ModelPlayerHistoryConditionInput
  ) {
    deletePlayerHistory(input: $input, condition: $condition) {
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
export const createLeague = /* GraphQL */ `
  mutation CreateLeague(
    $input: CreateLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    createLeague(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLeague = /* GraphQL */ `
  mutation UpdateLeague(
    $input: UpdateLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    updateLeague(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLeague = /* GraphQL */ `
  mutation DeleteLeague(
    $input: DeleteLeagueInput!
    $condition: ModelLeagueConditionInput
  ) {
    deleteLeague(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
