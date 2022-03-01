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
import {
  typeDefs as authTypeDefs,
  resolvers as authResolvers,
} from './auth.graphql';
import {
  typeDefs as userTypeDefs,
  resolvers as userResolvers,
} from './user.graphql';

// Define base Query/Mutation types to be extended
const typeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    teamTypeDefs,
    playerTypeDefs,
    authTypeDefs,
    userTypeDefs,
  ],
  resolvers: [
    teamResolvers,
    playerResolvers,
    authResolvers,
    userResolvers,
  ]
});
