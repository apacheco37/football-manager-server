import { PrismaClient, User } from "@prisma/client";
import { Response } from "express";
import { AuthService } from "../auth/auth.service";
import { MatchService } from "../match/match.service";
import { PlayerService } from "../player/player.service";
import { TeamService } from "../team/team.service";

export class ContextServices {
  private res: Response;
  private prismaClient: PrismaClient;
  private user: User | null;

  private _authService: AuthService | undefined;
  private _matchService: MatchService | undefined;
  private _playerService: PlayerService | undefined;
  private _teamService: TeamService | undefined;

  constructor(prismaClient: PrismaClient, user: User | null, res: Response) {
    this.prismaClient = prismaClient;
    this.user = user;
    this.res = res;
  }

  get authService() {
    if (!this._authService) {
      this._authService = new AuthService(
        this.res,
        this.prismaClient,
        this.user
      );
    }
    return this._authService;
  }

  get matchService() {
    if (!this._matchService) {
      this._matchService = new MatchService(
        this.res,
        this.prismaClient,
        this.user
      );
    }
    return this._matchService;
  }

  get playerService() {
    if (!this._playerService) {
      this._playerService = new PlayerService(
        this.res,
        this.prismaClient,
        this.user
      );
    }
    return this._playerService;
  }

  get teamService() {
    if (!this._teamService) {
      this._teamService = new TeamService(
        this.res,
        this.prismaClient,
        this.user
      );
    }
    return this._teamService;
  }
}
