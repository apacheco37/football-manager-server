import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { Request, Response } from 'express';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { schema } from './schema';
import { ContextServices } from './contextServices';

export type Context = {
  services: ContextServices;
};

const prisma = new PrismaClient();

export async function newApolloServer(httpServer: Server) {
  return new ApolloServer({
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
      const services = new ContextServices(prisma, user, res);
      return {
        services
      };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
}
