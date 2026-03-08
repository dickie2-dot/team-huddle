// ── Comprehensive dummy data for Team Huddle ──

export interface DummyClub {
  id: string;
  name: string;
  sport_id: string;
  sport: string;
  invite_code: string;
  match_fee: number;
  max_players: number;
  team_size: number;
  created_at: string;
}

export interface DummyPlayer {
  id: string;
  name: string;
  initials: string;
  position: string;
  is_active: boolean;
  confirmed: boolean;
  paymentStatus: "Paid" | "Pending" | "None";
}

export interface DummyMatch {
  id: string;
  title: string;
  match_date: string;
  match_time: string;
  location: string;
  notes: string;
  status: "open" | "locked" | "drafted" | "completed";
  max_players: number;
  confirmed_count: number;
}

export interface DummyMessage {
  id: string;
  user_name: string;
  user_initials: string;
  content: string;
  created_at: string;
  reactions?: { emoji: string; count: number; reacted: boolean }[];
}

export interface DummyPoll {
  id: string;
  question: string;
  options: { id: string; label: string; vote_count: number }[];
  total_votes: number;
  user_vote?: string;
}

export interface DummyFine {
  id: string;
  player_name: string;
  player_initials: string;
  amount: number;
  reason: string;
  emoji: string;
  match_title: string;
  date: string;
  issued_by: string;
  paid: boolean;
}

export interface DummyKittyTransaction {
  id: string;
  label: string;
  amount: number;
  type: "in" | "out";
  date: string;
  source?: "fine" | "voluntary" | "match_fee" | "expense";
  player_name?: string;
}

export interface DummyBibHistory {
  id: string;
  player_name: string;
  player_initials: string;
  week: string;
  date: string;
}

export interface DummyNotification {
  id: string;
  type: "match_joined" | "match_full" | "draft_generated" | "bib_washer" | "kitty_winner" | "new_message" | "poll_created" | "fine_issued" | "match_invite" | "reminder" | "payment_reminder" | "late_fine" | "spot_open" | "match_recap" | "auto_draft";
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

// ── Clubs ──
export const DUMMY_CLUBS: DummyClub[] = [
  { id: "c1", name: "Hackney Wanderers FC", sport_id: "football", sport: "Football", invite_code: "HACK2024", match_fee: 6, max_players: 14, team_size: 7, created_at: "2024-09-01" },
  { id: "c2", name: "South London Ballers", sport_id: "basketball", sport: "Basketball", invite_code: "SLBC5678", match_fee: 8, max_players: 10, team_size: 5, created_at: "2024-10-15" },
  { id: "c3", name: "Paddington Padel Club", sport_id: "padel", sport: "Padel", invite_code: "PADL9012", match_fee: 12, max_players: 4, team_size: 2, created_at: "2025-01-10" },
];

// ── Players (30) ──
export const DUMMY_PLAYERS: DummyPlayer[] = [
  { id: "p1", name: "Marcus Reid", initials: "MR", position: "ST", is_active: true, confirmed: true, paymentStatus: "Paid" },
  { id: "p2", name: "Jake Thornton", initials: "JT", position: "CM", is_active: true, confirmed: true, paymentStatus: "Paid" },
  { id: "p3", name: "Leo Vasquez", initials: "LV", position: "LW", is_active: true, confirmed: true, paymentStatus: "Paid" },
  { id: "p4", name: "Sam Okafor", initials: "SO", position: "CB", is_active: true, confirmed: true, paymentStatus: "Paid" },
  { id: "p5", name: "Dan Mitchell", initials: "DM", position: "GK", is_active: true, confirmed: true, paymentStatus: "Paid" },
  { id: "p6", name: "Kai Brennan", initials: "KB", position: "RB", is_active: true, confirmed: true, paymentStatus: "Paid" },
  { id: "p7", name: "Tom Ashford", initials: "TA", position: "CDM", is_active: true, confirmed: true, paymentStatus: "Paid" },
  { id: "p8", name: "Ryan Choi", initials: "RC", position: "CAM", is_active: true, confirmed: true, paymentStatus: "Pending" },
  { id: "p9", name: "Finn Gallagher", initials: "FG", position: "RW", is_active: true, confirmed: true, paymentStatus: "Pending" },
  { id: "p10", name: "Nate Pearson", initials: "NP", position: "CB", is_active: true, confirmed: true, paymentStatus: "Paid" },
  { id: "p11", name: "Will Harper", initials: "WH", position: "LB", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p12", name: "Zach Ellis", initials: "ZE", position: "ST", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p13", name: "Ben Kowalski", initials: "BK", position: "CM", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p14", name: "Omar Syed", initials: "OS", position: "RW", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p15", name: "Callum Brooks", initials: "CB", position: "GK", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p16", name: "Ethan Novak", initials: "EN", position: "CB", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p17", name: "Liam O'Brien", initials: "LO", position: "CM", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p18", name: "Max Turner", initials: "MT", position: "ST", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p19", name: "Josh Karim", initials: "JK", position: "LW", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p20", name: "Alex Petrov", initials: "AP", position: "RB", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p21", name: "Charlie Dunn", initials: "CD", position: "CDM", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p22", name: "Rory Fleming", initials: "RF", position: "CAM", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p23", name: "Aiden Cross", initials: "AC", position: "CB", is_active: true, confirmed: false, paymentStatus: "None" },
  { id: "p24", name: "Harry Webb", initials: "HW", position: "LB", is_active: false, confirmed: false, paymentStatus: "None" },
  { id: "p25", name: "George Banks", initials: "GB", position: "RW", is_active: false, confirmed: false, paymentStatus: "None" },
  { id: "p26", name: "Toby Shaw", initials: "TS", position: "GK", is_active: false, confirmed: false, paymentStatus: "None" },
  { id: "p27", name: "Isaac Park", initials: "IP", position: "ST", is_active: false, confirmed: false, paymentStatus: "None" },
  { id: "p28", name: "Noah Keane", initials: "NK", position: "CM", is_active: false, confirmed: false, paymentStatus: "None" },
  { id: "p29", name: "Dylan Frost", initials: "DF", position: "LW", is_active: false, confirmed: false, paymentStatus: "None" },
  { id: "p30", name: "Luke Santos", initials: "LS", position: "CB", is_active: false, confirmed: false, paymentStatus: "None" },
];

// ── Matches (5) ──
export const DUMMY_MATCHES: DummyMatch[] = [
  { id: "m1", title: "Thursday Night Football", match_date: "2026-03-12", match_time: "19:00", location: "Hackney Marshes Pitch 4", notes: "Bring shin pads", status: "open", max_players: 14, confirmed_count: 10 },
  { id: "m2", title: "Weekend Friendly", match_date: "2026-03-15", match_time: "14:00", location: "Victoria Park 3G", notes: "New bibs this week", status: "open", max_players: 14, confirmed_count: 6 },
  { id: "m3", title: "Thursday Night Football", match_date: "2026-03-05", match_time: "19:00", location: "Hackney Marshes Pitch 4", notes: "", status: "completed", max_players: 14, confirmed_count: 14 },
  { id: "m4", title: "Cup Semi-Final", match_date: "2026-02-28", match_time: "15:00", location: "Mabley Green Astro", notes: "Big game!", status: "completed", max_players: 14, confirmed_count: 14 },
  { id: "m5", title: "Thursday Night Football", match_date: "2026-02-19", match_time: "19:00", location: "Hackney Marshes Pitch 4", notes: "", status: "completed", max_players: 14, confirmed_count: 12 },
];

// ── Chat Messages ──
export const DUMMY_MESSAGES: DummyMessage[] = [
  { id: "msg1", user_name: "Marcus Reid", user_initials: "MR", content: "Who's in for Thursday?", created_at: "2026-03-08T09:15:00Z", reactions: [{ emoji: "👍", count: 5, reacted: true }] },
  { id: "msg2", user_name: "Jake Thornton", user_initials: "JT", content: "I'm in mate, same time as last week?", created_at: "2026-03-08T09:17:00Z" },
  { id: "msg3", user_name: "Leo Vasquez", user_initials: "LV", content: "Count me in 💪", created_at: "2026-03-08T09:18:00Z" },
  { id: "msg4", user_name: "Sam Okafor", user_initials: "SO", content: "Running 10 mins late, start without me", created_at: "2026-03-08T09:20:00Z", reactions: [{ emoji: "😂", count: 3, reacted: false }] },
  { id: "msg5", user_name: "Dan Mitchell", user_initials: "DM", content: "Has anyone got the bibs from last week?", created_at: "2026-03-08T09:22:00Z" },
  { id: "msg6", user_name: "Kai Brennan", user_initials: "KB", content: "Ryan had them I think", created_at: "2026-03-08T09:23:00Z" },
  { id: "msg7", user_name: "Ryan Choi", user_initials: "RC", content: "Yeah they're in my car, I'll bring them 👍", created_at: "2026-03-08T09:25:00Z", reactions: [{ emoji: "🙏", count: 4, reacted: true }] },
  { id: "msg8", user_name: "Tom Ashford", user_initials: "TA", content: "Anyone need a lift from Bethnal Green?", created_at: "2026-03-08T09:30:00Z" },
  { id: "msg9", user_name: "Finn Gallagher", user_initials: "FG", content: "Yes please! I'll be at the station at 6:30", created_at: "2026-03-08T09:32:00Z" },
  { id: "msg10", user_name: "Nate Pearson", user_initials: "NP", content: "Let's smash it this week lads 🔥", created_at: "2026-03-08T10:00:00Z", reactions: [{ emoji: "🔥", count: 7, reacted: true }, { emoji: "💪", count: 3, reacted: false }] },
  { id: "msg11", user_name: "Will Harper", user_initials: "WH", content: "Can't make it this week unfortunately, family thing", created_at: "2026-03-08T10:15:00Z", reactions: [{ emoji: "😢", count: 2, reacted: false }] },
  { id: "msg12", user_name: "Marcus Reid", user_initials: "MR", content: "No worries Will, we'll miss your nutmegs 😂", created_at: "2026-03-08T10:17:00Z" },
];

// ── Polls ──
export const DUMMY_POLLS: DummyPoll[] = [
  {
    id: "poll1",
    question: "What time works best for next Thursday?",
    options: [
      { id: "po1", label: "7:00 PM", vote_count: 6 },
      { id: "po2", label: "7:30 PM", vote_count: 3 },
      { id: "po3", label: "8:00 PM", vote_count: 1 },
    ],
    total_votes: 10,
    user_vote: "po1",
  },
  {
    id: "poll2",
    question: "Should we get new team shirts?",
    options: [
      { id: "po4", label: "Yes, green", vote_count: 5 },
      { id: "po5", label: "Yes, blue", vote_count: 4 },
      { id: "po6", label: "No, keep current", vote_count: 2 },
    ],
    total_votes: 11,
    user_vote: "po4",
  },
];

// ── Fines ──
export const FINE_REASONS = [
  { reason: "Late to match", emoji: "⏰", defaultAmount: 2 },
  { reason: "Missed sitter", emoji: "🤦", defaultAmount: 3 },
  { reason: "Nutmegged by teammate", emoji: "🥜", defaultAmount: 3 },
  { reason: "Forgot bibs", emoji: "👕", defaultAmount: 5 },
  { reason: "Own goal", emoji: "⚽", defaultAmount: 5 },
  { reason: "Too many stepovers", emoji: "💃", defaultAmount: 2 },
  { reason: "Turned up hungover", emoji: "🍺", defaultAmount: 10 },
  { reason: "Terrible haircut", emoji: "✂️", defaultAmount: 2 },
  { reason: "Forgot the balls", emoji: "🏐", defaultAmount: 5 },
  { reason: "VAR complaint", emoji: "📺", defaultAmount: 2 },
  { reason: "Wearing wrong boots", emoji: "👟", defaultAmount: 3 },
];

export const DUMMY_FINES: DummyFine[] = [
  { id: "f1", player_name: "Sam Okafor", player_initials: "SO", amount: 2, reason: "Late to match", emoji: "⏰", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Marcus Reid", paid: true },
  { id: "f2", player_name: "Ryan Choi", player_initials: "RC", amount: 5, reason: "Own goal", emoji: "⚽", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Marcus Reid", paid: false },
  { id: "f3", player_name: "Jake Thornton", player_initials: "JT", amount: 3, reason: "Nutmegged by teammate", emoji: "🥜", match_title: "Cup Semi-Final", date: "2026-02-28", issued_by: "Marcus Reid", paid: true },
  { id: "f4", player_name: "Leo Vasquez", player_initials: "LV", amount: 10, reason: "Turned up hungover", emoji: "🍺", match_title: "Cup Semi-Final", date: "2026-02-28", issued_by: "Dan Mitchell", paid: false },
  { id: "f5", player_name: "Tom Ashford", player_initials: "TA", amount: 2, reason: "Too many stepovers", emoji: "💃", match_title: "Thursday Night Football", date: "2026-02-19", issued_by: "Marcus Reid", paid: true },
  { id: "f6", player_name: "Finn Gallagher", player_initials: "FG", amount: 3, reason: "Missed sitter", emoji: "🤦", match_title: "Thursday Night Football", date: "2026-02-19", issued_by: "Sam Okafor", paid: true },
  { id: "f7", player_name: "Dan Mitchell", player_initials: "DM", amount: 5, reason: "Forgot bibs", emoji: "👕", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Marcus Reid", paid: false },
  { id: "f8", player_name: "Kai Brennan", player_initials: "KB", amount: 2, reason: "Terrible haircut", emoji: "✂️", match_title: "Cup Semi-Final", date: "2026-02-28", issued_by: "Jake Thornton", paid: true },
  { id: "f9", player_name: "Ryan Choi", player_initials: "RC", amount: 2, reason: "Late to match", emoji: "⏰", match_title: "Cup Semi-Final", date: "2026-02-28", issued_by: "Marcus Reid", paid: true },
  { id: "f10", player_name: "Sam Okafor", player_initials: "SO", amount: 3, reason: "Wearing wrong boots", emoji: "👟", match_title: "Thursday Night Football", date: "2026-02-19", issued_by: "Dan Mitchell", paid: false },
  { id: "f11", player_name: "Nate Pearson", player_initials: "NP", amount: 2, reason: "VAR complaint", emoji: "📺", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Marcus Reid", paid: false },
  { id: "f12", player_name: "Leo Vasquez", player_initials: "LV", amount: 5, reason: "Forgot the balls", emoji: "🏐", match_title: "Thursday Night Football", date: "2026-02-19", issued_by: "Marcus Reid", paid: true },
  { id: "f13", player_name: "Marcus Reid", player_initials: "MR", amount: 3, reason: "Missed sitter", emoji: "🤦", match_title: "Cup Semi-Final", date: "2026-02-28", issued_by: "Jake Thornton", paid: true },
  { id: "f14", player_name: "Jake Thornton", player_initials: "JT", amount: 2, reason: "Too many stepovers", emoji: "💃", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Sam Okafor", paid: false },
];

// ── Kitty Transactions ──
export const DUMMY_KITTY_TRANSACTIONS: DummyKittyTransaction[] = [
  { id: "kt1", label: "Match Fees (Mar 5)", amount: 84, type: "in", date: "2026-03-05", source: "match_fee" },
  { id: "kt2", label: "New Bibs", amount: 45, type: "out", date: "2026-03-03", source: "expense" },
  { id: "kt3", label: "Pitch Booking (Mar 5)", amount: 30, type: "out", date: "2026-03-01", source: "expense" },
  { id: "kt4", label: "Match Fees (Feb 28)", amount: 84, type: "in", date: "2026-02-28", source: "match_fee" },
  { id: "kt5", label: "Pitch Booking (Feb 28)", amount: 35, type: "out", date: "2026-02-26", source: "expense" },
  { id: "kt6", label: "Late to match fine", amount: 2, type: "in", date: "2026-03-05", source: "fine", player_name: "Sam Okafor" },
  { id: "kt7", label: "Own goal fine", amount: 5, type: "in", date: "2026-03-05", source: "fine", player_name: "Ryan Choi" },
  { id: "kt8", label: "Nutmegged fine", amount: 3, type: "in", date: "2026-02-28", source: "fine", player_name: "Jake Thornton" },
  { id: "kt9", label: "Hungover fine", amount: 10, type: "in", date: "2026-02-28", source: "fine", player_name: "Leo Vasquez" },
  { id: "kt10", label: "Forgot bibs fine", amount: 5, type: "in", date: "2026-03-05", source: "fine", player_name: "Dan Mitchell" },
  { id: "kt11", label: "Terrible haircut fine", amount: 2, type: "in", date: "2026-02-28", source: "fine", player_name: "Kai Brennan" },
  { id: "kt12", label: "Stepovers fine", amount: 2, type: "in", date: "2026-02-19", source: "fine", player_name: "Tom Ashford" },
  { id: "kt13", label: "Missed sitter fine", amount: 3, type: "in", date: "2026-02-19", source: "fine", player_name: "Finn Gallagher" },
  { id: "kt14", label: "Match Fees (Feb 19)", amount: 72, type: "in", date: "2026-02-19", source: "match_fee" },
  { id: "kt15", label: "Wrong boots fine", amount: 3, type: "in", date: "2026-02-19", source: "fine", player_name: "Sam Okafor" },
  { id: "kt16", label: "Late fine", amount: 2, type: "in", date: "2026-02-28", source: "fine", player_name: "Ryan Choi" },
  { id: "kt17", label: "Missed sitter fine", amount: 3, type: "in", date: "2026-02-28", source: "fine", player_name: "Marcus Reid" },
  { id: "kt18", label: "Stepovers fine", amount: 2, type: "in", date: "2026-03-05", source: "fine", player_name: "Jake Thornton" },
  { id: "kt19", label: "VAR complaint fine", amount: 2, type: "in", date: "2026-03-05", source: "fine", player_name: "Nate Pearson" },
  { id: "kt20", label: "Forgot balls fine", amount: 5, type: "in", date: "2026-02-19", source: "fine", player_name: "Leo Vasquez" },
];

// Kitty balance = sum of all in - sum of all out
export const KITTY_BALANCE = 289.0;

// ── Player Contributions (includes source) ──
export interface DummyContribution {
  name: string;
  amount: number;
  source: "fine" | "voluntary";
  label?: string;
}

export const DUMMY_CONTRIBUTIONS: DummyContribution[] = [
  { name: "Marcus Reid", amount: 36, source: "voluntary" },
  { name: "Marcus Reid", amount: 3, source: "fine", label: "Missed sitter" },
  { name: "Jake Thornton", amount: 36, source: "voluntary" },
  { name: "Jake Thornton", amount: 3, source: "fine", label: "Nutmegged" },
  { name: "Jake Thornton", amount: 2, source: "fine", label: "Too many stepovers" },
  { name: "Leo Vasquez", amount: 30, source: "voluntary" },
  { name: "Leo Vasquez", amount: 10, source: "fine", label: "Hungover" },
  { name: "Leo Vasquez", amount: 5, source: "fine", label: "Forgot the balls" },
  { name: "Sam Okafor", amount: 36, source: "voluntary" },
  { name: "Sam Okafor", amount: 2, source: "fine", label: "Late to match" },
  { name: "Sam Okafor", amount: 3, source: "fine", label: "Wrong boots" },
  { name: "Dan Mitchell", amount: 30, source: "voluntary" },
  { name: "Dan Mitchell", amount: 5, source: "fine", label: "Forgot bibs" },
  { name: "Kai Brennan", amount: 36, source: "voluntary" },
  { name: "Kai Brennan", amount: 2, source: "fine", label: "Terrible haircut" },
  { name: "Tom Ashford", amount: 18, source: "voluntary" },
  { name: "Tom Ashford", amount: 2, source: "fine", label: "Too many stepovers" },
  { name: "Ryan Choi", amount: 18, source: "voluntary" },
  { name: "Ryan Choi", amount: 5, source: "fine", label: "Own goal" },
  { name: "Ryan Choi", amount: 2, source: "fine", label: "Late to match" },
  { name: "Finn Gallagher", amount: 12, source: "voluntary" },
  { name: "Finn Gallagher", amount: 3, source: "fine", label: "Missed sitter" },
  { name: "Nate Pearson", amount: 36, source: "voluntary" },
  { name: "Nate Pearson", amount: 2, source: "fine", label: "VAR complaint" },
];

// ── Bib History ──
export const DUMMY_BIB_HISTORY: DummyBibHistory[] = [
  { id: "bh1", player_name: "Ryan Choi", player_initials: "RC", week: "Week 12", date: "2026-03-05" },
  { id: "bh2", player_name: "Sam Okafor", player_initials: "SO", week: "Week 11", date: "2026-02-28" },
  { id: "bh3", player_name: "Tom Ashford", player_initials: "TA", week: "Week 10", date: "2026-02-19" },
  { id: "bh4", player_name: "Kai Brennan", player_initials: "KB", week: "Week 9", date: "2026-02-12" },
  { id: "bh5", player_name: "Leo Vasquez", player_initials: "LV", week: "Week 8", date: "2026-02-05" },
];

// ── Notifications ──
export const DUMMY_NOTIFICATIONS: DummyNotification[] = [
  { id: "n1", type: "match_joined", title: "Player Joined", message: "Leo Vasquez secured a spot for Thursday", created_at: "2026-03-08T10:30:00Z", read: false },
  { id: "n2", type: "new_message", title: "New Message", message: "Nate Pearson: Let's smash it this week lads 🔥", created_at: "2026-03-08T10:00:00Z", read: false },
  { id: "n3", type: "fine_issued", title: "Fine Issued", message: "Ryan Choi fined £5 for Own goal ⚽", created_at: "2026-03-05T21:00:00Z", read: false },
  { id: "n4", type: "draft_generated", title: "Draft Generated", message: "Teams have been drafted for Thursday Night Football", created_at: "2026-03-05T18:30:00Z", read: true },
  { id: "n5", type: "bib_washer", title: "Bib Washer Selected", message: "Ryan Choi is on bib duty this week 👕", created_at: "2026-03-05T21:15:00Z", read: true },
  { id: "n6", type: "match_full", title: "Match Full", message: "Thursday Night Football is now full (14/14)", created_at: "2026-03-04T14:00:00Z", read: true },
  { id: "n7", type: "poll_created", title: "New Poll", message: "Vote: What time works best for next Thursday?", created_at: "2026-03-03T12:00:00Z", read: true },
  { id: "n8", type: "kitty_winner", title: "Wheel Winner", message: "Activity Roulette landed on Go-Karting! 🏎️", created_at: "2026-03-01T20:00:00Z", read: true },
];
