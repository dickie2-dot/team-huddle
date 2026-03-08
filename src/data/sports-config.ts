// ── Sport configuration for Team Huddle ──

export interface SportConfig {
  id: string;
  name: string;
  team_size: number;
  max_players: number;
  sport_category: "field sport" | "court sport" | "racket sport" | "bat sport" | "other";
  emoji: string;
}

export const SUPPORTED_SPORTS: SportConfig[] = [
  { id: "football", name: "Football", team_size: 7, max_players: 14, sport_category: "field sport", emoji: "⚽" },
  { id: "basketball", name: "Basketball", team_size: 5, max_players: 10, sport_category: "court sport", emoji: "🏀" },
  { id: "netball", name: "Netball", team_size: 7, max_players: 14, sport_category: "court sport", emoji: "🏐" },
  { id: "volleyball", name: "Volleyball", team_size: 6, max_players: 12, sport_category: "court sport", emoji: "🏐" },
  { id: "padel", name: "Padel", team_size: 2, max_players: 4, sport_category: "racket sport", emoji: "🎾" },
  { id: "tennis", name: "Tennis", team_size: 2, max_players: 4, sport_category: "racket sport", emoji: "🎾" },
  { id: "pickleball", name: "Pickleball", team_size: 2, max_players: 4, sport_category: "racket sport", emoji: "🏓" },
  { id: "badminton", name: "Badminton", team_size: 2, max_players: 4, sport_category: "racket sport", emoji: "🏸" },
  { id: "touch-rugby", name: "Touch Rugby", team_size: 7, max_players: 14, sport_category: "field sport", emoji: "🏉" },
  { id: "rugby", name: "Rugby", team_size: 7, max_players: 14, sport_category: "field sport", emoji: "🏉" },
  { id: "cricket", name: "Cricket", team_size: 11, max_players: 22, sport_category: "bat sport", emoji: "🏏" },
  { id: "softball", name: "Softball", team_size: 10, max_players: 20, sport_category: "bat sport", emoji: "🥎" },
  { id: "dodgeball", name: "Dodgeball", team_size: 6, max_players: 12, sport_category: "field sport", emoji: "🤾" },
  { id: "ultimate-frisbee", name: "Ultimate Frisbee", team_size: 7, max_players: 14, sport_category: "field sport", emoji: "🥏" },
];

export const getSportById = (id: string): SportConfig | undefined =>
  SUPPORTED_SPORTS.find((s) => s.id === id);

export const getDefaultSport = (): SportConfig => SUPPORTED_SPORTS[0];

/** For custom sports created by admins */
export interface CustomSport {
  name: string;
  team_size: number;
  max_players: number;
}

export const createCustomSportConfig = (custom: CustomSport): SportConfig => ({
  id: `custom-${custom.name.toLowerCase().replace(/\s+/g, "-")}`,
  name: custom.name,
  team_size: custom.team_size,
  max_players: custom.max_players,
  sport_category: "other",
  emoji: "🏅",
});
