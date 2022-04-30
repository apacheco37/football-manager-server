import { gql } from "apollo-server-core";
import { Context } from "../core/apolloServer";

const typeDefs = gql`
  input LoginInput {
    username: String!
    password: String!
  }

  input SignupInput {
    username: String!
    password: String!
    email: String!
  }

  extend type Query {
    verify: User
  }

  extend type Mutation {
    login(input: LoginInput!): User
    signup(input: SignupInput!): User!
  }
`;

const resolvers = {
  Query: {
    verify: (_parent: never, _: never, { services }: Context) => {
      return services.authService.verify();
    },
  },
  Mutation: {
    login: (
      _parent: never,
      {
        input: { username, password },
      }: {
        input: {
          username: string;
          password: string;
        };
      },
      { services }: Context
    ) => {
      return services.authService.login(username, password);
    },
    signup: (
      _parent: never,
      {
        input: { username, password, email },
      }: {
        input: {
          username: string;
          password: string;
          email: string;
        };
      },
      { services }: Context
    ) => {
      return services.authService.signup(username, email, password);
    },
  },
};

export { typeDefs, resolvers };
