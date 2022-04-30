import express from "express";
import http from "http";
import cookieParser from "cookie-parser";

import { newApolloServer } from "./core/apolloServer";

async function start() {
  // Required logic for integrating with Express
  const app = express();
  app.use(cookieParser());
  const httpServer = http.createServer(app);
  const port = process.env.PORT || 3001;

  const server = await newApolloServer(httpServer);
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: true, // todo
    },
    path: "/graphql",
  });

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `Server running at http://localhost:${port}${server.graphqlPath}`
  );
}

start();
