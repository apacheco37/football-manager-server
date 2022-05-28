import { MatchTeam, Prisma } from "@prisma/client";
import { BaseService } from "../core/baseService";
import MatchSimulation, { SimulatedMatch } from "./match-simulation";
import { PlayerOnLineupInput, PlayMatchInput } from "./match.graphql";

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
      data: this._buildMatchCreateInput(simulatedMatch),
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

  private _buildMatchCreateInput(
    simulatedMatch: SimulatedMatch
  ): Prisma.MatchCreateInput {
    const lineupPlayers = [
      ...simulatedMatch.homeLineup.map((player) => {
        return {
          position: player.position,
          playerID: player.player.id,
          lineupTeam: MatchTeam.HOME,
        };
      }),
      ...simulatedMatch.awayLineup.map((player) => {
        return {
          position: player.position,
          playerID: player.player.id,
          lineupTeam: MatchTeam.AWAY,
        };
      }),
    ];

    const events = simulatedMatch.events.map((event) => {
      return {
        minute: event.minute,
        type: event.type,
        team: event.team,
        players: {
          connect: event.players.map((player) => {
            return { id: player.id };
          }),
        },
      };
    });

    return {
      homeTeam: { connect: { id: simulatedMatch.homeTeam.id } },
      awayTeam: { connect: { id: simulatedMatch.awayTeam.id } },
      events: {
        create: events,
      },
      homeRatings: { create: simulatedMatch.homeRatings },
      awayRatings: { create: simulatedMatch.awayRatings },
      lineupPlayers: { createMany: { data: lineupPlayers } },
    };
  }
}
