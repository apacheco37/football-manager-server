import { gql } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  typeDefs as teamTypeDefs,
  resolvers as teamResolvers,
} from './team.graphql';
import {
  typeDefs as playerTypeDefs,
  resolvers as playerResolvers,
} from './player.graphql';

// Define base Query type to be extended
const typeDefs = gql`
  type Query {
    _empty: String
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    teamTypeDefs,
    playerTypeDefs,
  ],
  resolvers: [
    teamResolvers,
    playerResolvers,
  ]
});
