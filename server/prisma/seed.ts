import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type PlayerRole =
  | "attacking-fullback"
  | "box-striker"
  | "box-to-box"
  | "centre-back"
  | "creator"
  | "creator-forward"
  | "deep-playmaker"
  | "finisher"
  | "goalkeeper"
  | "pressing-forward"
  | "wide-creator";

type Player = {
  name: string;
  birthDate: string;
  nationality: string;
  position: string;
  teamName: string;
  role: PlayerRole;
  photo: string | null;
};

type TeamSeed = {
  name: string;
  country: string;
  logoUrl: string;
};

type RoleProfile = {
  minutes: number;
  goals: number;
  assists: number;
  shots: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  passAccuracy: number;
  yellowCards: number;
};

type PlayerStatSeed = {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  shots: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  passAccuracy: number;
};

const VALID_ROLES: readonly PlayerRole[] = [
  "attacking-fullback",
  "box-striker",
  "box-to-box",
  "centre-back",
  "creator",
  "creator-forward",
  "deep-playmaker",
  "finisher",
  "goalkeeper",
  "pressing-forward",
  "wide-creator"
];

const teams: readonly TeamSeed[] = [
  { name: "CA Boca Juniors", country: "Argentina", logoUrl: "https://placehold.co/120x120/003f8f/f7d117?text=BOC" },
  { name: "CA River Plate", country: "Argentina", logoUrl: "https://placehold.co/120x120/f2f2f2/d71920?text=RIV" },
  { name: "Al Hilal", country: "Arabia Saudita", logoUrl: "https://placehold.co/120x120/005baa/f2f2f2?text=HIL" },
  { name: "Arsenal", country: "Inglaterra", logoUrl: "https://placehold.co/120x120/ef0107/f2f2f2?text=ARS" },
  { name: "Aston Villa", country: "Inglaterra", logoUrl: "https://placehold.co/120x120/670e36/f2f2f2?text=AVL" },
  { name: "Atletico Madrid", country: "Espana", logoUrl: "https://placehold.co/120x120/c8102e/f2f2f2?text=ATM" },
  { name: "Bayern Munich", country: "Alemania", logoUrl: "https://placehold.co/120x120/dc052d/f2f2f2?text=BAY" },
  { name: "Benfica", country: "Portugal", logoUrl: "https://placehold.co/120x120/e83030/f2f2f2?text=BEN" },
  { name: "Borussia Dortmund", country: "Alemania", logoUrl: "https://placehold.co/120x120/fde100/0f0f0f?text=BVB" },
  { name: "Brentford", country: "Inglaterra", logoUrl: "https://placehold.co/120x120/e30613/f2f2f2?text=BRE" },
  { name: "Chelsea", country: "Inglaterra", logoUrl: "https://placehold.co/120x120/034694/f2f2f2?text=CHE" },
  { name: "Como", country: "Italia", logoUrl: "https://placehold.co/120x120/005bac/f2f2f2?text=COM" },
  { name: "Inter", country: "Italia", logoUrl: "https://placehold.co/120x120/0057b8/0f0f0f?text=INT" },
  { name: "Liverpool", country: "Inglaterra", logoUrl: "https://placehold.co/120x120/c8102e/f2f2f2?text=LIV" },
  { name: "Manchester City", country: "Inglaterra", logoUrl: "https://placehold.co/120x120/6cabdd/0f0f0f?text=MCI" },
  { name: "Olympique Lyonnais", country: "Francia", logoUrl: "https://placehold.co/120x120/003f8f/f2f2f2?text=OL" },
  { name: "Palmeiras", country: "Brasil", logoUrl: "https://placehold.co/120x120/006437/f2f2f2?text=PAL" },
  { name: "Paris Saint-Germain", country: "Francia", logoUrl: "https://placehold.co/120x120/004170/f2f2f2?text=PSG" },
  { name: "Real Madrid", country: "Espana", logoUrl: "https://placehold.co/120x120/f2f2f2/7533fc?text=RMA" },
  { name: "Roma", country: "Italia", logoUrl: "https://placehold.co/120x120/8e1f2f/f2f2f2?text=ROM" }
];

const players: readonly Player[] = [
  { name: "Miguel Angel Merentiel Serrano", birthDate: "1996-02-24", nationality: "Argentina", position: "Segundo delantero", teamName: "CA Boca Juniors", role: "finisher", photo: "Merentiel" },
  { name: "Paulo Dybala", birthDate: "1993-11-15", nationality: "Argentina", position: "Segundo delantero", teamName: "Roma", role: "creator-forward", photo: null },
  { name: "Facundo Colidio", birthDate: "2000-01-04", nationality: "Argentina", position: "Delantero centro", teamName: "CA River Plate", role: "creator-forward", photo: "Colidio" },
  { name: "Darwin Nunez", birthDate: "1999-06-24", nationality: "Uruguay", position: "Delantero centro", teamName: "Al Hilal", role: "box-striker", photo: null },
  { name: "Alvaro Morata", birthDate: "1992-10-23", nationality: "Espana", position: "Delantero centro", teamName: "Como", role: "finisher", photo: null },
  { name: "Julian Alvarez", birthDate: "2000-01-31", nationality: "Argentina", position: "Delantero", teamName: "Atletico Madrid", role: "pressing-forward", photo: null },
  { name: "Lautaro Martinez", birthDate: "1997-08-22", nationality: "Argentina", position: "Delantero", teamName: "Inter", role: "finisher", photo: null },
  { name: "Erling Haaland", birthDate: "2000-07-21", nationality: "Noruega", position: "Delantero", teamName: "Manchester City", role: "box-striker", photo: null },
  { name: "Vinicius Junior", birthDate: "2000-07-12", nationality: "Brasil", position: "Extremo izquierdo", teamName: "Real Madrid", role: "wide-creator", photo: null },
  { name: "Gabriel Martinelli", birthDate: "2001-06-18", nationality: "Brasil", position: "Extremo izquierdo", teamName: "Arsenal", role: "wide-creator", photo: null },
  { name: "Jamal Musiala", birthDate: "2003-02-26", nationality: "Alemania", position: "Mediocampista ofensivo", teamName: "Bayern Munich", role: "creator", photo: null },
  { name: "Martin Odegaard", birthDate: "1998-12-17", nationality: "Noruega", position: "Mediocampista ofensivo", teamName: "Arsenal", role: "creator", photo: null },
  { name: "Achraf Hakimi", birthDate: "1998-11-04", nationality: "Marruecos", position: "Lateral derecho", teamName: "Paris Saint-Germain", role: "attacking-fullback", photo: null },
  { name: "Noussair Mazraoui", birthDate: "1997-11-14", nationality: "Marruecos", position: "Lateral derecho", teamName: "Bayern Munich", role: "attacking-fullback", photo: null },
  { name: "Antonio Silva", birthDate: "2003-10-30", nationality: "Portugal", position: "Defensor central", teamName: "Benfica", role: "centre-back", photo: null },
  { name: "Franco Mastantuono", birthDate: "2007-08-14", nationality: "Argentina", position: "Mediocampista ofensivo", teamName: "Real Madrid", role: "creator", photo: null },
  { name: "Florian Wirtz", birthDate: "2003-05-03", nationality: "Alemania", position: "Mediocampista ofensivo", teamName: "Liverpool", role: "creator", photo: null },
  { name: "Bukayo Saka", birthDate: "2001-09-05", nationality: "Inglaterra", position: "Extremo derecho", teamName: "Arsenal", role: "wide-creator", photo: null },
  { name: "Cole Palmer", birthDate: "2002-05-06", nationality: "Inglaterra", position: "Extremo derecho", teamName: "Chelsea", role: "wide-creator", photo: null },
  { name: "Phil Foden", birthDate: "2000-05-28", nationality: "Inglaterra", position: "Mediocampista ofensivo", teamName: "Manchester City", role: "creator", photo: null },
  { name: "Rodrygo", birthDate: "2001-01-09", nationality: "Brasil", position: "Delantero", teamName: "Real Madrid", role: "creator-forward", photo: null },
  { name: "Federico Valverde", birthDate: "1998-07-22", nationality: "Uruguay", position: "Mediocampista central", teamName: "Real Madrid", role: "box-to-box", photo: null },
  { name: "Alessandro Bastoni", birthDate: "1999-04-13", nationality: "Italia", position: "Defensor central", teamName: "Inter", role: "centre-back", photo: null },
  { name: "Ruben Dias", birthDate: "1997-05-14", nationality: "Portugal", position: "Defensor central", teamName: "Manchester City", role: "centre-back", photo: null },
  { name: "Emiliano Martinez", birthDate: "1992-09-02", nationality: "Argentina", position: "Arquero", teamName: "Aston Villa", role: "goalkeeper", photo: null },
  { name: "Gregor Kobel", birthDate: "1997-12-06", nationality: "Suiza", position: "Arquero", teamName: "Borussia Dortmund", role: "goalkeeper", photo: null },
  { name: "Yann Sommer", birthDate: "1988-12-17", nationality: "Suiza", position: "Arquero", teamName: "Inter", role: "goalkeeper", photo: null },
  { name: "Caoimhin Kelleher", birthDate: "1998-11-23", nationality: "Irlanda", position: "Arquero", teamName: "Brentford", role: "goalkeeper", photo: null },
  { name: "Joshua Kimmich", birthDate: "1995-02-08", nationality: "Alemania", position: "Mediocampista central", teamName: "Bayern Munich", role: "deep-playmaker", photo: null },
  { name: "Enzo Fernandez", birthDate: "2001-01-17", nationality: "Argentina", position: "Mediocampista defensivo", teamName: "Chelsea", role: "deep-playmaker", photo: null },
  { name: "Declan Rice", birthDate: "1999-01-14", nationality: "Inglaterra", position: "Mediocampista defensivo", teamName: "Arsenal", role: "deep-playmaker", photo: null },
  { name: "Joao Neves", birthDate: "2004-09-27", nationality: "Portugal", position: "Mediocampista central", teamName: "Paris Saint-Germain", role: "box-to-box", photo: null },
  { name: "Pablo Barrios", birthDate: "2003-06-15", nationality: "Espana", position: "Mediocampista central", teamName: "Atletico Madrid", role: "box-to-box", photo: null },
  { name: "Evan Ferguson", birthDate: "2004-10-19", nationality: "Irlanda", position: "Delantero", teamName: "Roma", role: "box-striker", photo: null },
  { name: "Claudio Echeverri", birthDate: "2006-01-02", nationality: "Argentina", position: "Mediocampista ofensivo", teamName: "CA River Plate", role: "creator", photo: null },
  { name: "William Saliba", birthDate: "2001-03-24", nationality: "Francia", position: "Defensor central", teamName: "Arsenal", role: "centre-back", photo: null },
  { name: "Rayan Cherki", birthDate: "2003-08-17", nationality: "Francia", position: "Mediocampista ofensivo", teamName: "Olympique Lyonnais", role: "creator", photo: null },
  { name: "Nuno Mendes", birthDate: "2002-06-19", nationality: "Portugal", position: "Lateral izquierdo", teamName: "Paris Saint-Germain", role: "attacking-fullback", photo: null },
  { name: "Theo Hernandez", birthDate: "1997-10-06", nationality: "Francia", position: "Lateral izquierdo", teamName: "Al Hilal", role: "attacking-fullback", photo: null },
  { name: "Marcus Thuram", birthDate: "1997-08-06", nationality: "Francia", position: "Delantero centro", teamName: "Inter", role: "creator-forward", photo: null },
  { name: "Gianluigi Donnarumma", birthDate: "1999-02-25", nationality: "Italia", position: "Arquero", teamName: "Paris Saint-Germain", role: "goalkeeper", photo: null },
  { name: "Karim Adeyemi", birthDate: "2002-01-18", nationality: "Alemania", position: "Delantero", teamName: "Borussia Dortmund", role: "wide-creator", photo: null },
  { name: "Endrick", birthDate: "2006-07-21", nationality: "Brasil", position: "Delantero", teamName: "Palmeiras", role: "box-striker", photo: null }
];

const roleProfiles: Record<PlayerRole, RoleProfile> = {
  "box-striker": { minutes: 0.72, goals: 0.78, assists: 0.12, shots: 4.25, keyPasses: 0.85, tackles: 0.55, interceptions: 0.22, passAccuracy: 75.5, yellowCards: 0.16 },
  finisher: { minutes: 0.78, goals: 0.58, assists: 0.18, shots: 3.35, keyPasses: 1.08, tackles: 0.78, interceptions: 0.34, passAccuracy: 77.8, yellowCards: 0.2 },
  "creator-forward": { minutes: 0.7, goals: 0.34, assists: 0.28, shots: 2.45, keyPasses: 1.85, tackles: 0.92, interceptions: 0.42, passAccuracy: 79.8, yellowCards: 0.14 },
  "pressing-forward": { minutes: 0.78, goals: 0.43, assists: 0.25, shots: 2.85, keyPasses: 1.65, tackles: 1.25, interceptions: 0.55, passAccuracy: 80.4, yellowCards: 0.18 },
  "wide-creator": { minutes: 0.76, goals: 0.28, assists: 0.32, shots: 2.65, keyPasses: 2.25, tackles: 1.1, interceptions: 0.5, passAccuracy: 81.3, yellowCards: 0.12 },
  creator: { minutes: 0.74, goals: 0.22, assists: 0.35, shots: 2.25, keyPasses: 2.8, tackles: 1.35, interceptions: 0.62, passAccuracy: 84.7, yellowCards: 0.15 },
  "box-to-box": { minutes: 0.82, goals: 0.13, assists: 0.16, shots: 1.35, keyPasses: 1.55, tackles: 2.35, interceptions: 1.35, passAccuracy: 86.8, yellowCards: 0.22 },
  "deep-playmaker": { minutes: 0.84, goals: 0.08, assists: 0.22, shots: 0.9, keyPasses: 2.2, tackles: 2.05, interceptions: 1.65, passAccuracy: 89.4, yellowCards: 0.2 },
  "attacking-fullback": { minutes: 0.8, goals: 0.05, assists: 0.22, shots: 0.75, keyPasses: 1.85, tackles: 2.4, interceptions: 1.35, passAccuracy: 84.2, yellowCards: 0.2 },
  "centre-back": { minutes: 0.86, goals: 0.05, assists: 0.04, shots: 0.5, keyPasses: 0.42, tackles: 1.65, interceptions: 2.25, passAccuracy: 90.2, yellowCards: 0.18 },
  goalkeeper: { minutes: 0.91, goals: 0, assists: 0.01, shots: 0, keyPasses: 0.08, tackles: 0.05, interceptions: 0.02, passAccuracy: 74.5, yellowCards: 0.04 }
};

const playerOverrides: Record<string, Partial<RoleProfile>> = {
  "Miguel Angel Merentiel Serrano": { goals: 0.48, assists: 0.22, shots: 3.22, keyPasses: 1.56, tackles: 0.82, interceptions: 0.56, passAccuracy: 76.4, minutes: 0.68 },
  "Facundo Colidio": { goals: 0.32, assists: 0.18, shots: 2.88, keyPasses: 1.92, tackles: 1.36, interceptions: 0.72, passAccuracy: 73.3, minutes: 0.59 },
  "Erling Haaland": { goals: 0.92, shots: 4.65, keyPasses: 0.7 },
  "Vinicius Junior": { goals: 0.36, assists: 0.38, shots: 3.15, keyPasses: 2.5 },
  "Florian Wirtz": { goals: 0.27, assists: 0.42, keyPasses: 3.05, passAccuracy: 86.1 },
  "Federico Valverde": { minutes: 0.9, tackles: 2.65, interceptions: 1.55, passAccuracy: 88.6 }
};

const seasonStatOverrides: Record<string, Record<number, Partial<PlayerStatSeed>>> = {
  "Miguel Angel Merentiel Serrano": {
    2026: {
      appearances: 10,
      minutesPlayed: 754,
      goals: 4,
      assists: 2,
      shots: 33,
      keyPasses: 13,
      tackles: 7,
      interceptions: 5,
      passAccuracy: 76.4,
      yellowCards: 2,
      redCards: 0
    }
  },
  "Facundo Colidio": {
    2026: {
      appearances: 9,
      minutesPlayed: 534,
      goals: 2,
      assists: 1,
      shots: 18,
      keyPasses: 12,
      tackles: 8,
      interceptions: 7,
      passAccuracy: 73.3,
      yellowCards: 1,
      redCards: 0
    }
  },
  "Julian Alvarez": {
    2026: { appearances: 12, minutesPlayed: 892, goals: 5, assists: 4, shots: 31, keyPasses: 20, tackles: 14, interceptions: 6, passAccuracy: 81.2 }
  },
  "Lautaro Martinez": {
    2026: { appearances: 11, minutesPlayed: 928, goals: 7, assists: 2, shots: 39, keyPasses: 12, tackles: 9, interceptions: 4, passAccuracy: 78.8 }
  }
};

const seasons = [
  { name: "2024", year: 2024, multiplier: 0.94 },
  { name: "2025", year: 2025, multiplier: 1 },
  { name: "2026", year: 2026, multiplier: 1.06 }
];

const expectedFilterCoverage = {
  minOptionsPerFilter: 1,
  minPlayersPerOption: 1,
  positions: [
    "Mediocampista ofensivo",
    "Mediocampista central",
    "Defensor central",
    "Delantero centro",
    "Mediocampista defensivo",
    "Delantero",
    "Arquero",
    "Lateral izquierdo",
    "Extremo izquierdo",
    "Lateral derecho",
    "Extremo derecho",
    "Segundo delantero"
  ],
  nationalities: [
    "Alemania",
    "Argentina",
    "Brasil",
    "Espana",
    "Inglaterra",
    "Francia",
    "Irlanda",
    "Italia",
    "Marruecos",
    "Noruega",
    "Portugal",
    "Suiza",
    "Uruguay"
  ],
  teamCountries: ["Alemania", "Arabia Saudita", "Argentina", "Brasil", "Espana", "Francia", "Inglaterra", "Italia", "Portugal"]
};

function statsFor(player: Player, index: number, seasonIndex: number): PlayerStatSeed {
  const season = seasons[seasonIndex];
  const generated = statsForBase(player, index, seasonIndex);
  const override = seasonStatOverrides[player.name]?.[season.year];

  return {
    ...generated,
    ...(override || {})
  };
}

function statsForBase(player: Player, index: number, seasonIndex: number): PlayerStatSeed {
  const profile: RoleProfile = { ...roleProfiles[player.role], ...(playerOverrides[player.name] || {}) };
  const season = seasons[seasonIndex];
  const variance = 1 + (((index % 5) - 2) * 0.035) + ((seasonIndex - 1) * 0.035);
  const minutesRatio = clamp(profile.minutes * (0.96 + seasonIndex * 0.035 + ((index % 4) - 1) * 0.025), 0.38, 0.94);
  const appearances = clampInt(Math.round(22 + minutesRatio * 15 + (index % 4)), 14, 38);
  const minutesPlayed = clampInt(Math.round(3420 * minutesRatio), 780, 3210);
  const volume = minutesPlayed / 90;
  const stat = (key: keyof typeof profile) => Math.max(0, Number(profile[key]) * season.multiplier * variance);
  const cardRate = Math.max(0, Number(profile.yellowCards) * (1 + (index % 3) * 0.08));

  return {
    appearances,
    goals: Math.round(stat("goals") * volume),
    assists: Math.round(stat("assists") * volume),
    yellowCards: Math.round(cardRate * volume),
    redCards: (index + seasonIndex) % 19 === 0 ? 1 : 0,
    minutesPlayed,
    shots: Math.round(stat("shots") * volume),
    keyPasses: Math.round(stat("keyPasses") * volume),
    tackles: Math.round(stat("tackles") * volume),
    interceptions: Math.round(stat("interceptions") * volume),
    passAccuracy: Number(clamp(Number(profile.passAccuracy) + (seasonIndex - 1) * 0.8 + ((index % 6) - 2) * 0.35, 68, 93.8).toFixed(1))
  };
}

async function main() {
  assertSeedCoverage();

  await prisma.playerStats.deleteMany();
  await prisma.player.deleteMany();
  await prisma.season.deleteMany();
  await prisma.team.deleteMany();

  const createdTeams = await Promise.all(teams.map((team) => prisma.team.create({ data: team })));
  const teamByName = new Map(createdTeams.map((team) => [team.name, team.id]));
  const createdSeasons = await Promise.all(seasons.map((season) => prisma.season.create({ data: { name: season.name, year: season.year } })));

  for (const [index, player] of players.entries()) {
    const teamId = teamByName.get(player.teamName);

    if (!teamId) {
      throw new Error(`Missing team ${player.teamName}`);
    }

    const createdPlayer = await prisma.player.create({
      data: {
        name: player.name,
        birthDate: new Date(player.birthDate),
        nationality: player.nationality,
        position: player.position,
        photoUrl: `https://placehold.co/300x300/151515/f2f2f2?text=${encodeURIComponent(player.photo || player.name.split(" ").slice(-1)[0])}`,
        teamId
      }
    });

    await Promise.all(
      createdSeasons.map((season, seasonIndex) =>
        prisma.playerStats.create({
          data: {
            playerId: createdPlayer.id,
            seasonId: season.id,
            ...statsFor(player, index, seasonIndex)
          }
        })
      )
    );
  }
}

function assertSeedCoverage() {
  assertPlayerIntegrity();

  const positions = countBy(players.map((player) => player.position));
  const nationalities = countBy(players.map((player) => player.nationality));
  const teamByName = new Map(teams.map((team) => [team.name, team]));
  const teamCountriesWithPlayers = countBy(
    players.map((player) => {
      const team = teamByName.get(player.teamName);

      if (!team) {
        throw new Error(`Seed player ${player.name} references missing team ${player.teamName}`);
      }

      return team.country;
    })
  );
  const teamsWithoutPlayers = teams.filter((team) => !players.some((player) => player.teamName === team.name));

  assertCovered("position", expectedFilterCoverage.positions, positions);
  assertCovered("nationality", expectedFilterCoverage.nationalities, nationalities);
  assertCovered("team country", expectedFilterCoverage.teamCountries, teamCountriesWithPlayers);
  assertNoUnexpected("nationality", expectedFilterCoverage.nationalities, nationalities);
  assertNoUnexpected("team country", expectedFilterCoverage.teamCountries, teamCountriesWithPlayers);
  assertMinimumOptions("position", positions, expectedFilterCoverage.minOptionsPerFilter);
  assertMinimumOptions("nationality", nationalities, expectedFilterCoverage.minOptionsPerFilter);
  assertMinimumOptions("team country", teamCountriesWithPlayers, expectedFilterCoverage.minOptionsPerFilter);
  assertRepeatedOptions("position", positions, expectedFilterCoverage.minPlayersPerOption);
  assertRepeatedOptions("nationality", nationalities, expectedFilterCoverage.minPlayersPerOption);
  assertRepeatedOptions("team country", teamCountriesWithPlayers, expectedFilterCoverage.minPlayersPerOption);

  if (teamsWithoutPlayers.length > 0) {
    throw new Error(`Seed teams without players: ${teamsWithoutPlayers.map((team) => team.name).join(", ")}`);
  }
}

function assertPlayerIntegrity() {
  const validRoles = new Set<PlayerRole>(VALID_ROLES);
  const validPositions = new Set(expectedFilterCoverage.positions);
  const teamByName = new Map(teams.map((team) => [team.name, team]));
  const playerNames = new Set<string>();
  const ambiguousNationalityPlayers = players.filter((player) => player.nationality === "Europa");
  const ambiguousCountryTeams = teams.filter((team) => team.country === "Europa");
  const duplicateNames = players
    .filter((player) => {
      if (playerNames.has(player.name)) {
        return true;
      }

      playerNames.add(player.name);
      return false;
    })
    .map((player) => player.name);
  const invalidRoles = players.filter((player) => !validRoles.has(player.role));
  const invalidPositions = players.filter((player) => !validPositions.has(player.position));
  const missingTeams = players.filter((player) => !teamByName.has(player.teamName));
  const invalidPhotos = players.filter((player) => player.photo !== null && player.photo.trim() === "");

  if (ambiguousNationalityPlayers.length > 0) {
    throw new Error(`Seed players cannot use Europa as nationality: ${ambiguousNationalityPlayers.map((player) => player.name).join(", ")}`);
  }

  if (ambiguousCountryTeams.length > 0) {
    throw new Error(`Seed teams cannot use Europa as country: ${ambiguousCountryTeams.map((team) => team.name).join(", ")}`);
  }

  if (duplicateNames.length > 0) {
    throw new Error(`Seed has duplicated player names: ${duplicateNames.join(", ")}`);
  }

  if (invalidRoles.length > 0) {
    throw new Error(`Seed has invalid player roles: ${invalidRoles.map((player) => `${player.name} (${player.role})`).join(", ")}`);
  }

  if (invalidPositions.length > 0) {
    throw new Error(`Seed has invalid player positions: ${invalidPositions.map((player) => `${player.name} (${player.position})`).join(", ")}`);
  }

  if (missingTeams.length > 0) {
    throw new Error(`Seed has players with missing teams: ${missingTeams.map((player) => `${player.name} (${player.teamName})`).join(", ")}`);
  }

  if (invalidPhotos.length > 0) {
    throw new Error(`Seed photo must be a non-empty string or null: ${invalidPhotos.map((player) => player.name).join(", ")}`);
  }
}

function assertCovered(label: string, expected: string[], actual: Map<string, number>) {
  const missing = expected.filter((value) => !actual.has(value));

  if (missing.length > 0) {
    throw new Error(`Seed is missing ${label} filter coverage for: ${missing.join(", ")}`);
  }
}

function assertNoUnexpected(label: string, expected: string[], actual: Map<string, number>) {
  const allowed = new Set(expected);
  const unexpected = [...actual.keys()].filter((value) => !allowed.has(value));

  if (unexpected.length > 0) {
    throw new Error(`Seed has unexpected ${label} filter option(s): ${unexpected.join(", ")}`);
  }
}

function assertMinimumOptions(label: string, actual: Map<string, number>, minOptions: number) {
  if (actual.size < minOptions) {
    throw new Error(`Seed needs at least ${minOptions} ${label} filter option(s), found ${actual.size}`);
  }
}

function assertRepeatedOptions(label: string, actual: Map<string, number>, minPlayers: number) {
  const weakOptions = [...actual.entries()]
    .filter(([, count]) => count < minPlayers)
    .map(([value, count]) => `${value} (${count})`);

  if (weakOptions.length > 0) {
    throw new Error(`Seed ${label} options need at least ${minPlayers} players: ${weakOptions.join(", ")}`);
  }
}

function countBy(values: string[]) {
  return values.reduce((acc, value) => {
    acc.set(value, (acc.get(value) || 0) + 1);
    return acc;
  }, new Map<string, number>());
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clampInt(value: number, min: number, max: number) {
  return Math.round(clamp(value, min, max));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });



