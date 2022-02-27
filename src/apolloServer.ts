import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express, { Request, Response } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { PrismaClient, User } from '@prisma/client';

import { schema } from './schema';

export type Context = {
  prisma: PrismaClient,
  res: Response,
  user: User | null;
};

const prisma = new PrismaClient();

export async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  app.use(cookieParser());
  const httpServer = http.createServer(app);
  const port = process.env.PORT || 3000;

  const server = new ApolloServer({
    schema,
    context: async ({ req, res }: { req: Request, res: Response }): Promise<Context> => {
      const token = req.cookies?.Authentication || '';
      let user = null;
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "TODO") as jwt.JwtPayload;
        user = await prisma.user.findUnique({
          where: {
            id: decodedToken.userID
          }
        });
      }
      return {
        user,
        prisma,
        res,
      };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: true, // todo
    },
    path: '/graphql'
  });

  // Modified server startup
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  console.log(`Server running at http://localhost:${port}${server.graphqlPath}`);
}
