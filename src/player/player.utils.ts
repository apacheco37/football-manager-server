import { faker } from "@faker-js/faker";

import { getRandomIntInRange } from "../utils/getRandomIntInRange";

export function randomPlayer(teamID?: string) {
  const player = {
    firstName: faker.name.firstName("male"),
    lastName: faker.name.lastName("male"),
    age: getRandomIntInRange(18, 35),
    talent: getRandomIntInRange(1, 10),
    attacker: getRandomIntInRange(0, 100),
    midfielder: getRandomIntInRange(0, 100),
    defender: getRandomIntInRange(0, 100),
    goalkeeper: getRandomIntInRange(0, 100),
    teamID: teamID ?? null,
  };
  return player;
}
