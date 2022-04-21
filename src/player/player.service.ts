import { AuthenticationError } from "apollo-server-core";

import { BaseService } from "../core/baseService";

export class PlayerService extends BaseService {
  async getPlayer(id: string) {
    if (!this.user) {
      throw new AuthenticationError("User is not authenticated.");
    }

    return await this.prismaClient.player.findUnique({
      where: {
        id,
      },
    });
  }
}
