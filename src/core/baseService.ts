import { PrismaClient, User } from "@prisma/client";
import { Response } from 'express';

export class BaseService {
  protected res: Response;
  protected prismaClient: PrismaClient;
  protected user: User | null;

  constructor(
    res: Response,
    prismaClient: PrismaClient,
    user: User | null,
  ) {
    this.res = res;
    this.prismaClient = prismaClient;
    this.user = user;
  }
}
