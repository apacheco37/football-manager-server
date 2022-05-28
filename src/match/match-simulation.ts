import {
  MatchEventType,
  MatchTeam,
  Player,
  Prisma,
  Team,
} from "@prisma/client";
import { getRandomIntInRange } from "../utils/getRandomIntInRange";
import { Position } from "./match.graphql";

const MAX_ATTACKERS = 3;
const MAX_MIDFIELDERS = 5;
const MAX_DEFENDERS = 5;
const PERIOD_MINUTES = 9;
const MATCH_LENGTH = 90;
const INJURY_FACTOR = 0.4; // 2 injuries every 5 matches

interface PlayerOnLineup {
  player: Player;
  position: Position;
}

interface MatchRatings {
  attack: number;
  midfield: number;
  defense: number;
  goalkeeping: number;
}

interface MatchEvent {
  minute: number;
  type: MatchEventType;
  team: MatchTeam;
  players: Player[];
}

export interface SimulatedMatch {
  homeTeam: Team;
  awayTeam: Team;
  events: MatchEvent[];
  homeRatings: MatchRatings;
  awayRatings: MatchRatings;
  homeLineup: PlayerOnLineup[];
  awayLineup: PlayerOnLineup[];
}

class MatchSimulation {
  homeTeam: Team;
  awayTeam: Team;
  homeLineup: PlayerOnLineup[];
  awayLineup: PlayerOnLineup[];
  homeRatings: Prisma.MatchRatingsCreateInput;
  awayRatings: Prisma.MatchRatingsCreateInput;

  constructor({
    homeTeam,
    awayTeam,
    homeLineup,
    awayLineup,
  }: {
    homeTeam: Team;
    awayTeam: Team;
    homeLineup: PlayerOnLineup[];
    awayLineup: PlayerOnLineup[];
  }) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.homeLineup = homeLineup;
    this.awayLineup = awayLineup;
    this.homeRatings = calculateTeamRatings(this.homeLineup);
    this.awayRatings = calculateTeamRatings(this.awayLineup);
  }

  simulateMatch() {
    const match: SimulatedMatch = {
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      events: this._simulateEvents(),
      homeRatings: this.homeRatings,
      awayRatings: this.awayRatings,
      homeLineup: this.homeLineup,
      awayLineup: this.awayLineup,
    };
    return match;
  }

  private _simulateEvents() {
    const events = [];
    let actualPeriodMinute = 0;
    while (actualPeriodMinute < MATCH_LENGTH) {
      // check each possible match event
      if (checkInjury()) {
        events.push(this._injuryEvent(actualPeriodMinute));
      }
      const teamWithChance = determineTeamWithChance(
        this.homeRatings.midfield,
        this.awayRatings.midfield
      );
      if (teamWithChance === MatchTeam.HOME) {
        if (this._checkGoal(MatchTeam.HOME)) {
          events.push(this._goalEvent(actualPeriodMinute, MatchTeam.HOME));
        }
      } else {
        if (this._checkGoal(MatchTeam.AWAY)) {
          events.push(this._goalEvent(actualPeriodMinute, MatchTeam.AWAY));
        }
      }
      // check card
      // check substitution
      actualPeriodMinute += PERIOD_MINUTES;
    }
    return events;
  }

  private _injuryEvent(actualPeriodMinute: number) {
    const affectedTeam = Math.random() < 0.5 ? MatchTeam.HOME : MatchTeam.AWAY;
    const affectedPlayer =
      affectedTeam === MatchTeam.HOME
        ? this.homeLineup[getRandomIntInRange(0, this.homeLineup.length - 1)]
            .player
        : this.awayLineup[getRandomIntInRange(0, this.awayLineup.length - 1)]
            .player;
    return {
      minute: getRandomIntInRange(
        actualPeriodMinute,
        PERIOD_MINUTES + actualPeriodMinute
      ),
      type: MatchEventType.INJURY,
      team: affectedTeam,
      players: [affectedPlayer],
    };
  }

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _checkGoal(team: MatchTeam) {
    return true;
  }

  private _goalEvent(actualPeriodMinute: number, matchTeam: MatchTeam) {
    const goalScorer =
      matchTeam === MatchTeam.HOME
        ? this.homeLineup[getRandomIntInRange(1, this.homeLineup.length - 1)]
            .player // excluded keeper
        : this.awayLineup[getRandomIntInRange(1, this.awayLineup.length - 1)]
            .player; // excluded keeper
    return {
      minute: getRandomIntInRange(
        actualPeriodMinute,
        PERIOD_MINUTES + actualPeriodMinute
      ),
      type: MatchEventType.GOAL,
      team: matchTeam,
      players: [goalScorer],
    };
  }
}

function calculateTeamRatings(lineup: PlayerOnLineup[]) {
  const totalRatings = {
    attack: 0,
    midfield: 0,
    defense: 0,
    goalkeeping: 0,
  };
  lineup.forEach(({ player, position }) => {
    switch (position) {
      case Position.GOALKEEPER:
        totalRatings.goalkeeping += player.goalkeeper;
        break;
      case Position.DEFENDER:
        totalRatings.defense += player.defender;
        break;
      case Position.MIDFIELDER:
        totalRatings.midfield += player.midfielder;
        break;
      case Position.ATTACKER:
        totalRatings.attack += player.attacker;
        break;
    }
  });

  const teamRatings = {
    attack: totalRatings.attack / MAX_ATTACKERS,
    midfield: totalRatings.midfield / MAX_MIDFIELDERS,
    defense: totalRatings.defense / MAX_DEFENDERS,
    goalkeeping: totalRatings.goalkeeping,
  };

  return teamRatings;
}

function determineTeamWithChance(
  homeMidfieldRating: number,
  awayMidfieldRating: number
): MatchTeam {
  const homeChancePercentage =
    (homeMidfieldRating * 100) / (homeMidfieldRating + awayMidfieldRating);
  return getRandomIntInRange(0, 100) < homeChancePercentage
    ? MatchTeam.HOME
    : MatchTeam.AWAY;
}

function checkInjury() {
  return Math.random() < INJURY_FACTOR;
}

export default MatchSimulation;
