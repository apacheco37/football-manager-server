import { gql } from "apollo-server-core";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Context } from "./apolloServer";

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

  extend type Mutation {
    login(input: LoginInput!): User
    signup(input: SignupInput!): User!
  }
`;

const resolvers = {
  Mutation: {
    login: async (
      _parent: never,
      { input }: {
        input: {
          username: string,
          password: string,
        }
      },
      context: Context
    ) => {
      const { password, username } = input;
      const user = await context.prisma.user.findUnique({
        where: {
          username,
        }
      });
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET || "TODO");
          context.res.cookie('Authentication', token, {
            secure: true,
            sameSite: 'none',
          });
          return user;
        }
      }
      return null;
    },
    signup: async (
      _parent: never,
      { input }: {
        input: {
          username: string,
          password: string,
          email: string,
        }
      },
      context: Context
    ) => {
      const { email, username } = input;
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await context.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword
        }
      });
      return user;
    },
  },
};

export { typeDefs, resolvers };
