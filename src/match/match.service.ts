import { BaseService } from "../core/baseService";
import MatchSimulation from "./match-simulation";
import { PlayerOnLineupInput, PlayMatchInput } from "./match.graphql";
import { buildMatchCreateInput } from "./match.utils";

export class MatchService extends BaseService {
  async playMatch(input: PlayMatchInput) {
    const { homeTeam, awayTeam } = await this._getMatchTeams(
      input.homeTeamID,
      input.awayTeamID
    );

    const { homeLineup, awayLineup } = await this._getMatchLineups(
      input.homeLineup,
      input.awayLineup
    );

    const simulatedMatch = new MatchSimulation({
      homeTeam,
      awayTeam,
      homeLineup,
      awayLineup,
    }).simulateMatch();

    const match = await this.prismaClient.match.create({
      data: buildMatchCreateInput(simulatedMatch),
      include: {
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
      },
    });
    return match;
  }

  async getMatch(id: string) {
    const match = await this.prismaClient.match.findUnique({
      where: {
        id,
      },
      include: {
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
      },
    });
    return match;
  }

  private async _getMatchTeams(homeTeamID: string, awayTeamID: string) {
    const homeTeam = await this.prismaClient.team.findUnique({
      where: {
        id: homeTeamID,
      },
    });
    if (!homeTeam) {
      throw new Error("Home team not found");
    }

    const awayTeam = await this.prismaClient.team.findUnique({
      where: {
        id: awayTeamID,
      },
    });
    if (!awayTeam) {
      throw new Error("Away team not found");
    }

    return { homeTeam, awayTeam };
  }

  private async _getMatchLineups(
    homeLineupInput: PlayerOnLineupInput[],
    awayLineupInput: PlayerOnLineupInput[]
  ) {
    const homeLineupPlayers = await this.prismaClient.player.findMany({
      where: {
        id: {
          in: homeLineupInput.map((playerOnLineup) => playerOnLineup.playerID),
        },
      },
    });
    if (homeLineupPlayers.length !== homeLineupInput.length) {
      throw new Error(
        "One or more players from the Home team lineup could not be found"
      );
    }
    const awayLineupPlayers = await this.prismaClient.player.findMany({
      where: {
        id: {
          in: awayLineupInput.map((playerOnLineup) => playerOnLineup.playerID),
        },
      },
    });
    if (awayLineupPlayers.length !== awayLineupInput.length) {
      throw new Error(
        "One or more players from the Away team lineup could not be found"
      );
    }

    const homeLineup = homeLineupInput.map((playerOnLineupInput) => {
      const player = homeLineupPlayers.find(
        (homeLineupPlayer) =>
          homeLineupPlayer.id === playerOnLineupInput.playerID
      );
      if (!player) {
        throw new Error("fuck");
      }
      return {
        player,
        position: playerOnLineupInput.position,
      };
    });
    const awayLineup = awayLineupInput.map((playerOnLineupInput) => {
      const player = awayLineupPlayers.find(
        (awayLineupPlayer) =>
          awayLineupPlayer.id === playerOnLineupInput.playerID
      );
      if (!player) {
        throw new Error("fuck");
      }
      return {
        player,
        position: playerOnLineupInput.position,
      };
    });

    return { homeLineup, awayLineup };
  }
}
