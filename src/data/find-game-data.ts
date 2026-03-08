// ── Find a Game demo data ──

export interface OpenClub {
  id: string;
  name: string;
  sport: string;
  emoji: string;
  logo_color: string;
}

export interface OpenMatch {
  id: string;
  club_id: string;
  club_name: string;
  sport: string;
  sport_emoji: string;
  title: string;
  match_date: string;
  match_time: string;
  location: string;
  venue_area: string;
  fee: number;
  max_players: number;
  confirmed_count: number;
  is_public: boolean;
  skill_level: "any" | "beginner" | "intermediate" | "advanced";
}

// ── 3 Clubs ──
export const OPEN_CLUBS: OpenClub[] = [
  { id: "club-1", name: "Hackney Wanderers FC", sport: "football", emoji: "⚽", logo_color: "hsl(150 75% 36%)" },
  { id: "club-2", name: "Shoreditch Ballers", sport: "basketball", emoji: "🏀", logo_color: "hsl(28 100% 52%)" },
  { id: "club-3", name: "Padel Social Club", sport: "padel", emoji: "🎾", logo_color: "hsl(220 80% 55%)" },
];

// ── 10 Upcoming open matches ──
export const OPEN_MATCHES: OpenMatch[] = [
  {
    id: "om-1", club_id: "club-1", club_name: "Hackney Wanderers FC",
    sport: "football", sport_emoji: "⚽", title: "Sunday League Kickabout",
    match_date: "2026-03-15", match_time: "10:00",
    location: "London Fields, Hackney", venue_area: "East London",
    fee: 6, max_players: 14, confirmed_count: 9, is_public: true, skill_level: "any",
  },
  {
    id: "om-2", club_id: "club-2", club_name: "Shoreditch Ballers",
    sport: "basketball", sport_emoji: "🏀", title: "3v3 Half-Court Pickup",
    match_date: "2026-03-14", match_time: "18:30",
    location: "Haggerston Park Courts", venue_area: "East London",
    fee: 4, max_players: 6, confirmed_count: 4, is_public: true, skill_level: "intermediate",
  },
  {
    id: "om-3", club_id: "club-3", club_name: "Padel Social Club",
    sport: "padel", sport_emoji: "🎾", title: "Midweek Padel Doubles",
    match_date: "2026-03-12", match_time: "19:00",
    location: "We Are Padel, Canary Wharf", venue_area: "Canary Wharf",
    fee: 12, max_players: 4, confirmed_count: 3, is_public: true, skill_level: "any",
  },
  {
    id: "om-4", club_id: "club-1", club_name: "Hackney Wanderers FC",
    sport: "football", sport_emoji: "⚽", title: "Midweek 5-a-side",
    match_date: "2026-03-11", match_time: "20:00",
    location: "Powerleague Shoreditch", venue_area: "East London",
    fee: 8, max_players: 10, confirmed_count: 10, is_public: true, skill_level: "any",
  },
  {
    id: "om-5", club_id: "club-2", club_name: "Shoreditch Ballers",
    sport: "basketball", sport_emoji: "🏀", title: "Saturday Full Court Run",
    match_date: "2026-03-21", match_time: "11:00",
    location: "Bethnal Green Leisure Centre", venue_area: "East London",
    fee: 5, max_players: 10, confirmed_count: 6, is_public: true, skill_level: "any",
  },
  {
    id: "om-6", club_id: "club-3", club_name: "Padel Social Club",
    sport: "padel", sport_emoji: "🎾", title: "Sunday Morning Padel",
    match_date: "2026-03-22", match_time: "09:00",
    location: "Stratford Padel Hub", venue_area: "Stratford",
    fee: 10, max_players: 4, confirmed_count: 1, is_public: true, skill_level: "beginner",
  },
  {
    id: "om-7", club_id: "club-1", club_name: "Hackney Wanderers FC",
    sport: "football", sport_emoji: "⚽", title: "Bank Holiday Tournament",
    match_date: "2026-03-30", match_time: "10:00",
    location: "Victoria Park", venue_area: "East London",
    fee: 10, max_players: 14, confirmed_count: 7, is_public: true, skill_level: "intermediate",
  },
  {
    id: "om-8", club_id: "club-2", club_name: "Shoreditch Ballers",
    sport: "basketball", sport_emoji: "🏀", title: "Private Training Session",
    match_date: "2026-03-18", match_time: "19:00",
    location: "Mile End Leisure Centre", venue_area: "East London",
    fee: 3, max_players: 10, confirmed_count: 5, is_public: false, skill_level: "advanced",
  },
  {
    id: "om-9", club_id: "club-3", club_name: "Padel Social Club",
    sport: "padel", sport_emoji: "🎾", title: "Friday Night Padel Social",
    match_date: "2026-03-20", match_time: "20:00",
    location: "We Are Padel, Canary Wharf", venue_area: "Canary Wharf",
    fee: 14, max_players: 4, confirmed_count: 2, is_public: true, skill_level: "any",
  },
  {
    id: "om-10", club_id: "club-1", club_name: "Hackney Wanderers FC",
    sport: "football", sport_emoji: "⚽", title: "Casual Friday Evening Kick",
    match_date: "2026-03-13", match_time: "18:00",
    location: "Mabley Green", venue_area: "Hackney",
    fee: 5, max_players: 14, confirmed_count: 11, is_public: true, skill_level: "beginner",
  },
];

export const getSlotsLeft = (m: OpenMatch) => m.max_players - m.confirmed_count;
export const isFull = (m: OpenMatch) => getSlotsLeft(m) <= 0;
