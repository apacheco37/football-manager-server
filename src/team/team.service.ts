import { AuthenticationError } from "apollo-server-core";

import { BaseService } from "../core/baseService";

export class TeamService extends BaseService {
  async getTeam(id: string) {
    if (!this.user) {
      throw new AuthenticationError("User is not authenticated.");
    }

    return this.prismaClient.team.findUnique({
      where: {
        id,
      },
    });
  }
}
