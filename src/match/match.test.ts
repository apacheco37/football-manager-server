import { MatchEventType, MatchTeam } from "@prisma/client";

import { MatchSummary } from "./match.graphql";
import { GetMatch } from "./match.service";
import { getMatchSummary } from "./match.utils";

describe("getMatchSummary", () => {
  test("correctly calculates scored goals and cards", () => {
    const events: GetMatch["events"] = [
      {
        id: "",
        minute: 3,
        type: MatchEventType.GOAL,
        team: MatchTeam.AWAY,
        matchID: "",
        players: [],
      },
      {
        id: "",
        minute: 3,
        type: MatchEventType.GOAL,
        team: MatchTeam.HOME,
        matchID: "",
        players: [],
      },
      {
        id: "",
        minute: 3,
        type: MatchEventType.GOAL,
        team: MatchTeam.AWAY,
        matchID: "",
        players: [],
      },
      {
        id: "",
        minute: 3,
        type: MatchEventType.CARD,
        team: MatchTeam.HOME,
        matchID: "",
        players: [],
      },
    ];

    const summary: MatchSummary = {
      homeGoals: 1,
      awayGoals: 2,
      homeCards: 1,
      awayCards: 0,
    };

    expect(getMatchSummary(events)).toEqual(summary);
  });
});
