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
      breaks
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
        breaks
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
