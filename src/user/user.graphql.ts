import { gql } from "apollo-server-core";
// import { Context } from "./apolloServer";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    team: Team
  }
`;

const resolvers = {
  // Query: {},
  // Mutation: {},
};

export { typeDefs, resolvers };
