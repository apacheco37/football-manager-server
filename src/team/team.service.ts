import { Prisma } from "@prisma/client";
import { AuthenticationError } from "apollo-server-core";

import { BaseService } from "../core/baseService";

export type TeamWithMatches = Prisma.TeamGetPayload<{
  include: {
    homeMatches: true;
    awayMatches: true;
  };
}>;

export class TeamService extends BaseService {
  async getTeam(id: string): Promise<TeamWithMatches | null> {
    if (!this.user) {
      throw new AuthenticationError("User is not authenticated.");
    }

    const matchInclude = {
      homeTeam: true,
      awayTeam: true,
      events: {
        include: {
          players: true,
        },
      },
      homeRatings: true,
      awayRatings: true,
      lineupPlayers: {
        include: {
          player: true,
        },
      },
    };

    return this.prismaClient.team.findUnique({
      where: {
        id,
      },
      include: {
        homeMatches: {
          include: matchInclude,
        },
        awayMatches: {
          include: matchInclude,
        },
      },
    });
  }

  getTeamMatches(team: TeamWithMatches) {
    return [...team.homeMatches, ...team.awayMatches];
  }
}
