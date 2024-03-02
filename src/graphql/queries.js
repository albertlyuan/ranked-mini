/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPlayer = /* GraphQL */ `
  query GetPlayer($id: ID!) {
    getPlayer(id: $id) {
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
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const playersByLeagueID = /* GraphQL */ `
  query PlayersByLeagueID(
    $leagueID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playersByLeagueID(
      leagueID: $leagueID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
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
export const listGames = /* GraphQL */ `
  query ListGames(
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const gamesByLeagueID = /* GraphQL */ `
  query GamesByLeagueID(
    $leagueID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gamesByLeagueID(
      leagueID: $leagueID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPlayerHistory = /* GraphQL */ `
  query GetPlayerHistory($id: ID!) {
    getPlayerHistory(id: $id) {
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
export const listPlayerHistories = /* GraphQL */ `
  query ListPlayerHistories(
    $filter: ModelPlayerHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayerHistories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const playerHistoriesByPlayerID = /* GraphQL */ `
  query PlayerHistoriesByPlayerID(
    $playerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerHistoriesByPlayerID(
      playerID: $playerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const playerHistoriesByGameID = /* GraphQL */ `
  query PlayerHistoriesByGameID(
    $gameID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerHistoriesByGameID(
      gameID: $gameID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getLeague = /* GraphQL */ `
  query GetLeague($id: ID!) {
    getLeague(id: $id) {
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
export const listLeagues = /* GraphQL */ `
  query ListLeagues(
    $filter: ModelLeagueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLeagues(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        leagueName
        adminUID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
