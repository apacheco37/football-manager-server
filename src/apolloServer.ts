import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { PrismaClient } from '@prisma/client';

import { schema } from './schema';

export type Context = {
  prisma: PrismaClient,
};

export async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);
  const port = process.env.PORT || 3000;

  const server = new ApolloServer({
    schema,
    context: {
      prisma: new PrismaClient(),
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql'
  });

  // Modified server startup
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  console.log(`Server running at http://localhost:${port}${server.graphqlPath}`);
}
