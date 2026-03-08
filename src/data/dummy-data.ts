// ── Comprehensive demo season for Team Huddle ──

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

export interface DummyContribution {
  name: string;
  amount: number;
  source: "fine" | "voluntary";
  label?: string;
}

// ── Club ──
export const DUMMY_CLUBS: DummyClub[] = [
  { id: "c1", name: "Hackney Wanderers FC", sport_id: "football", sport: "Football", invite_code: "HACK2024", match_fee: 6, max_players: 14, team_size: 7, created_at: "2026-01-05" },
];

// ── 15 Players ──
export const DUMMY_PLAYERS: DummyPlayer[] = [
  { id: "p1",  name: "Marcus Reid",      initials: "MR", position: "ST",  is_active: true,  confirmed: true,  paymentStatus: "Paid" },
  { id: "p2",  name: "Jake Thornton",    initials: "JT", position: "CM",  is_active: true,  confirmed: true,  paymentStatus: "Paid" },
  { id: "p3",  name: "Leo Vasquez",      initials: "LV", position: "LW",  is_active: true,  confirmed: true,  paymentStatus: "Paid" },
  { id: "p4",  name: "Sam Okafor",       initials: "SO", position: "CB",  is_active: true,  confirmed: true,  paymentStatus: "Paid" },
  { id: "p5",  name: "Dan Mitchell",     initials: "DM", position: "GK",  is_active: true,  confirmed: true,  paymentStatus: "Paid" },
  { id: "p6",  name: "Kai Brennan",      initials: "KB", position: "RB",  is_active: true,  confirmed: true,  paymentStatus: "Paid" },
  { id: "p7",  name: "Tom Ashford",      initials: "TA", position: "CDM", is_active: true,  confirmed: true,  paymentStatus: "Paid" },
  { id: "p8",  name: "Ryan Choi",        initials: "RC", position: "CAM", is_active: true,  confirmed: true,  paymentStatus: "Pending" },
  { id: "p9",  name: "Finn Gallagher",   initials: "FG", position: "RW",  is_active: true,  confirmed: true,  paymentStatus: "Pending" },
  { id: "p10", name: "Nate Pearson",     initials: "NP", position: "CB",  is_active: true,  confirmed: true,  paymentStatus: "Paid" },
  { id: "p11", name: "Will Harper",      initials: "WH", position: "LB",  is_active: true,  confirmed: false, paymentStatus: "None" },
  { id: "p12", name: "Zach Ellis",       initials: "ZE", position: "ST",  is_active: true,  confirmed: false, paymentStatus: "None" },
  { id: "p13", name: "Ben Kowalski",     initials: "BK", position: "CM",  is_active: true,  confirmed: false, paymentStatus: "None" },
  { id: "p14", name: "Omar Syed",        initials: "OS", position: "RW",  is_active: true,  confirmed: false, paymentStatus: "None" },
  { id: "p15", name: "Callum Brooks",    initials: "CB", position: "GK",  is_active: true,  confirmed: false, paymentStatus: "None" },
];

// ── 8 Matches (6 completed, 2 upcoming) ──
export const DUMMY_MATCHES: DummyMatch[] = [
  // Upcoming
  { id: "m1", title: "Thursday Night Football",  match_date: "2026-03-12", match_time: "19:00", location: "Hackney Marshes Pitch 4",   notes: "Bring shin pads",       status: "open",      max_players: 14, confirmed_count: 10 },
  { id: "m2", title: "Weekend Friendly",         match_date: "2026-03-15", match_time: "14:00", location: "Victoria Park 3G",          notes: "New bibs this week",     status: "open",      max_players: 14, confirmed_count: 6 },
  // Completed
  { id: "m3", title: "Thursday Night Football",  match_date: "2026-03-05", match_time: "19:00", location: "Hackney Marshes Pitch 4",   notes: "",                       status: "completed", max_players: 14, confirmed_count: 14 },
  { id: "m4", title: "Cup Semi-Final",           match_date: "2026-02-28", match_time: "15:00", location: "Mabley Green Astro",        notes: "Big game!",              status: "completed", max_players: 14, confirmed_count: 14 },
  { id: "m5", title: "Thursday Night Football",  match_date: "2026-02-19", match_time: "19:00", location: "Hackney Marshes Pitch 4",   notes: "",                       status: "completed", max_players: 14, confirmed_count: 12 },
  { id: "m6", title: "Thursday Night Football",  match_date: "2026-02-12", match_time: "19:00", location: "Hackney Marshes Pitch 4",   notes: "Floodlights confirmed",  status: "completed", max_players: 14, confirmed_count: 14 },
  { id: "m7", title: "Weekend Kickabout",        match_date: "2026-02-07", match_time: "11:00", location: "London Fields Astro",       notes: "Hangover rules apply",   status: "completed", max_players: 14, confirmed_count: 10 },
  { id: "m8", title: "Season Opener",            match_date: "2026-01-29", match_time: "19:00", location: "Hackney Marshes Pitch 4",   notes: "Let's go lads!",         status: "completed", max_players: 14, confirmed_count: 14 },
];

// ── Chat Messages (25 messages, realistic banter) ──
export const DUMMY_MESSAGES: DummyMessage[] = [
  { id: "msg1",  user_name: "Marcus Reid",    user_initials: "MR", content: "Who's in for Thursday? Need numbers ASAP 🗓️",                     created_at: "2026-03-08T09:15:00Z", reactions: [{ emoji: "👍", count: 6, reacted: true }] },
  { id: "msg2",  user_name: "Jake Thornton",  user_initials: "JT", content: "I'm in mate. Same time as last week?",                            created_at: "2026-03-08T09:17:00Z" },
  { id: "msg3",  user_name: "Leo Vasquez",    user_initials: "LV", content: "Count me in 💪",                                                  created_at: "2026-03-08T09:18:00Z" },
  { id: "msg4",  user_name: "Sam Okafor",     user_initials: "SO", content: "Running 10 mins late, start without me",                          created_at: "2026-03-08T09:20:00Z", reactions: [{ emoji: "😂", count: 4, reacted: false }] },
  { id: "msg5",  user_name: "Dan Mitchell",   user_initials: "DM", content: "Has anyone got the bibs from last week?",                         created_at: "2026-03-08T09:22:00Z" },
  { id: "msg6",  user_name: "Kai Brennan",    user_initials: "KB", content: "Ryan had them I think",                                           created_at: "2026-03-08T09:23:00Z" },
  { id: "msg7",  user_name: "Ryan Choi",      user_initials: "RC", content: "Yeah they're in my car, I'll bring them 👍",                       created_at: "2026-03-08T09:25:00Z", reactions: [{ emoji: "🙏", count: 4, reacted: true }] },
  { id: "msg8",  user_name: "Tom Ashford",    user_initials: "TA", content: "Anyone need a lift from Bethnal Green?",                           created_at: "2026-03-08T09:30:00Z" },
  { id: "msg9",  user_name: "Finn Gallagher", user_initials: "FG", content: "Yes please! I'll be at the station at 6:30",                      created_at: "2026-03-08T09:32:00Z" },
  { id: "msg10", user_name: "Nate Pearson",   user_initials: "NP", content: "Let's smash it this week lads 🔥",                                 created_at: "2026-03-08T10:00:00Z", reactions: [{ emoji: "🔥", count: 8, reacted: true }, { emoji: "💪", count: 4, reacted: false }] },
  { id: "msg11", user_name: "Will Harper",    user_initials: "WH", content: "Can't make it this week unfortunately, family thing",              created_at: "2026-03-08T10:15:00Z", reactions: [{ emoji: "😢", count: 2, reacted: false }] },
  { id: "msg12", user_name: "Marcus Reid",    user_initials: "MR", content: "No worries Will, we'll miss your nutmegs 😂",                      created_at: "2026-03-08T10:17:00Z" },
  { id: "msg13", user_name: "Zach Ellis",     user_initials: "ZE", content: "I'm in. Playing up front yeah?",                                  created_at: "2026-03-08T10:20:00Z" },
  { id: "msg14", user_name: "Jake Thornton",  user_initials: "JT", content: "You're playing wherever the draft puts you mate 😂",               created_at: "2026-03-08T10:22:00Z", reactions: [{ emoji: "😂", count: 5, reacted: true }] },
  { id: "msg15", user_name: "Ben Kowalski",   user_initials: "BK", content: "Anyone seen Leo's new boots? Absolute state 👟",                   created_at: "2026-03-08T11:00:00Z" },
  { id: "msg16", user_name: "Leo Vasquez",    user_initials: "LV", content: "Oi! They're limited edition 😤",                                   created_at: "2026-03-08T11:02:00Z", reactions: [{ emoji: "😂", count: 6, reacted: false }] },
  { id: "msg17", user_name: "Omar Syed",      user_initials: "OS", content: "Limited edition from the bargain bin maybe",                       created_at: "2026-03-08T11:03:00Z", reactions: [{ emoji: "🔥", count: 3, reacted: true }] },
  { id: "msg18", user_name: "Sam Okafor",     user_initials: "SO", content: "Remember that own goal last week? Still can't believe it 😂",       created_at: "2026-03-08T12:00:00Z" },
  { id: "msg19", user_name: "Ryan Choi",      user_initials: "RC", content: "It was a tactical back pass that went wrong ok…",                  created_at: "2026-03-08T12:02:00Z", reactions: [{ emoji: "😂", count: 7, reacted: true }] },
  { id: "msg20", user_name: "Dan Mitchell",   user_initials: "DM", content: "A 'tactical back pass' from the halfway line? Sure Ryan 🤣",       created_at: "2026-03-08T12:05:00Z" },
  { id: "msg21", user_name: "Callum Brooks",  user_initials: "CB", content: "Can I play outfield this week? Tired of being in net",             created_at: "2026-03-08T13:00:00Z" },
  { id: "msg22", user_name: "Marcus Reid",    user_initials: "MR", content: "Nice try Callum 😂 we need you between the sticks",                created_at: "2026-03-08T13:05:00Z" },
  { id: "msg23", user_name: "Kai Brennan",    user_initials: "KB", content: "Who's paying for pitch? Jake you still owe from last time",        created_at: "2026-03-08T14:00:00Z" },
  { id: "msg24", user_name: "Jake Thornton",  user_initials: "JT", content: "I paid! Check the kitty mate",                                    created_at: "2026-03-08T14:02:00Z" },
  { id: "msg25", user_name: "Tom Ashford",    user_initials: "TA", content: "Right who wants to be on my team? I'll carry all of you 💪😂",      created_at: "2026-03-08T15:00:00Z", reactions: [{ emoji: "😂", count: 5, reacted: false }, { emoji: "🧢", count: 2, reacted: true }] },
];

// ── Polls ──
export const DUMMY_POLLS: DummyPoll[] = [
  {
    id: "poll1",
    question: "What time works best for next Thursday?",
    options: [
      { id: "po1", label: "7:00 PM", vote_count: 7 },
      { id: "po2", label: "7:30 PM", vote_count: 4 },
      { id: "po3", label: "8:00 PM", vote_count: 2 },
    ],
    total_votes: 13,
    user_vote: "po1",
  },
  {
    id: "poll2",
    question: "Should we get new team shirts?",
    options: [
      { id: "po4", label: "Yes, green", vote_count: 6 },
      { id: "po5", label: "Yes, blue", vote_count: 5 },
      { id: "po6", label: "No, keep current", vote_count: 2 },
    ],
    total_votes: 13,
    user_vote: "po4",
  },
  {
    id: "poll3",
    question: "End of season social — what are we doing?",
    options: [
      { id: "po7", label: "Go-Karting", vote_count: 5 },
      { id: "po8", label: "Pub crawl", vote_count: 4 },
      { id: "po9", label: "Bowling", vote_count: 3 },
      { id: "po10", label: "Paintball", vote_count: 1 },
    ],
    total_votes: 13,
    user_vote: "po7",
  },
];

// ── Fine Reasons ──
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

// ── Fines (spread across 6 completed matches) ──
export const DUMMY_FINES: DummyFine[] = [
  // Match 3 – Mar 5
  { id: "f1",  player_name: "Sam Okafor",     player_initials: "SO", amount: 2,  reason: "Late to match",          emoji: "⏰", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Marcus Reid",   paid: true },
  { id: "f2",  player_name: "Ryan Choi",      player_initials: "RC", amount: 5,  reason: "Own goal",               emoji: "⚽", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Marcus Reid",   paid: false },
  { id: "f3",  player_name: "Dan Mitchell",   player_initials: "DM", amount: 5,  reason: "Forgot bibs",            emoji: "👕", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Marcus Reid",   paid: false },
  { id: "f4",  player_name: "Nate Pearson",   player_initials: "NP", amount: 2,  reason: "VAR complaint",          emoji: "📺", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Marcus Reid",   paid: false },
  { id: "f5",  player_name: "Jake Thornton",  player_initials: "JT", amount: 2,  reason: "Too many stepovers",     emoji: "💃", match_title: "Thursday Night Football", date: "2026-03-05", issued_by: "Sam Okafor",    paid: false },
  // Match 4 – Feb 28
  { id: "f6",  player_name: "Jake Thornton",  player_initials: "JT", amount: 3,  reason: "Nutmegged by teammate",  emoji: "🥜", match_title: "Cup Semi-Final",          date: "2026-02-28", issued_by: "Marcus Reid",   paid: true },
  { id: "f7",  player_name: "Leo Vasquez",    player_initials: "LV", amount: 10, reason: "Turned up hungover",     emoji: "🍺", match_title: "Cup Semi-Final",          date: "2026-02-28", issued_by: "Dan Mitchell",  paid: false },
  { id: "f8",  player_name: "Kai Brennan",    player_initials: "KB", amount: 2,  reason: "Terrible haircut",       emoji: "✂️", match_title: "Cup Semi-Final",          date: "2026-02-28", issued_by: "Jake Thornton", paid: true },
  { id: "f9",  player_name: "Ryan Choi",      player_initials: "RC", amount: 2,  reason: "Late to match",          emoji: "⏰", match_title: "Cup Semi-Final",          date: "2026-02-28", issued_by: "Marcus Reid",   paid: true },
  { id: "f10", player_name: "Marcus Reid",    player_initials: "MR", amount: 3,  reason: "Missed sitter",          emoji: "🤦", match_title: "Cup Semi-Final",          date: "2026-02-28", issued_by: "Jake Thornton", paid: true },
  // Match 5 – Feb 19
  { id: "f11", player_name: "Tom Ashford",    player_initials: "TA", amount: 2,  reason: "Too many stepovers",     emoji: "💃", match_title: "Thursday Night Football", date: "2026-02-19", issued_by: "Marcus Reid",   paid: true },
  { id: "f12", player_name: "Finn Gallagher", player_initials: "FG", amount: 3,  reason: "Missed sitter",          emoji: "🤦", match_title: "Thursday Night Football", date: "2026-02-19", issued_by: "Sam Okafor",    paid: true },
  { id: "f13", player_name: "Sam Okafor",     player_initials: "SO", amount: 3,  reason: "Wearing wrong boots",    emoji: "👟", match_title: "Thursday Night Football", date: "2026-02-19", issued_by: "Dan Mitchell",  paid: false },
  { id: "f14", player_name: "Leo Vasquez",    player_initials: "LV", amount: 5,  reason: "Forgot the balls",       emoji: "🏐", match_title: "Thursday Night Football", date: "2026-02-19", issued_by: "Marcus Reid",   paid: true },
  // Match 6 – Feb 12
  { id: "f15", player_name: "Zach Ellis",     player_initials: "ZE", amount: 2,  reason: "Late to match",          emoji: "⏰", match_title: "Thursday Night Football", date: "2026-02-12", issued_by: "Marcus Reid",   paid: true },
  { id: "f16", player_name: "Ben Kowalski",   player_initials: "BK", amount: 3,  reason: "Nutmegged by teammate",  emoji: "🥜", match_title: "Thursday Night Football", date: "2026-02-12", issued_by: "Leo Vasquez",   paid: true },
  { id: "f17", player_name: "Omar Syed",      player_initials: "OS", amount: 2,  reason: "Terrible haircut",       emoji: "✂️", match_title: "Thursday Night Football", date: "2026-02-12", issued_by: "Kai Brennan",   paid: true },
  // Match 7 – Feb 7
  { id: "f18", player_name: "Kai Brennan",    player_initials: "KB", amount: 10, reason: "Turned up hungover",     emoji: "🍺", match_title: "Weekend Kickabout",       date: "2026-02-07", issued_by: "Marcus Reid",   paid: true },
  { id: "f19", player_name: "Tom Ashford",    player_initials: "TA", amount: 3,  reason: "Missed sitter",          emoji: "🤦", match_title: "Weekend Kickabout",       date: "2026-02-07", issued_by: "Dan Mitchell",  paid: true },
  { id: "f20", player_name: "Nate Pearson",   player_initials: "NP", amount: 5,  reason: "Forgot the balls",       emoji: "🏐", match_title: "Weekend Kickabout",       date: "2026-02-07", issued_by: "Sam Okafor",    paid: true },
  // Match 8 – Jan 29
  { id: "f21", player_name: "Will Harper",    player_initials: "WH", amount: 2,  reason: "Late to match",          emoji: "⏰", match_title: "Season Opener",           date: "2026-01-29", issued_by: "Marcus Reid",   paid: true },
  { id: "f22", player_name: "Callum Brooks",  player_initials: "CB", amount: 2,  reason: "VAR complaint",          emoji: "📺", match_title: "Season Opener",           date: "2026-01-29", issued_by: "Jake Thornton", paid: true },
  { id: "f23", player_name: "Finn Gallagher", player_initials: "FG", amount: 5,  reason: "Own goal",               emoji: "⚽", match_title: "Season Opener",           date: "2026-01-29", issued_by: "Marcus Reid",   paid: true },
];

// ── Kitty Transactions (match fees + fine flows + expenses) ──
export const DUMMY_KITTY_TRANSACTIONS: DummyKittyTransaction[] = [
  // Match fees
  { id: "kt1",  label: "Match Fees (Mar 5)",  amount: 84,  type: "in",  date: "2026-03-05", source: "match_fee" },
  { id: "kt2",  label: "Match Fees (Feb 28)", amount: 84,  type: "in",  date: "2026-02-28", source: "match_fee" },
  { id: "kt3",  label: "Match Fees (Feb 19)", amount: 72,  type: "in",  date: "2026-02-19", source: "match_fee" },
  { id: "kt4",  label: "Match Fees (Feb 12)", amount: 84,  type: "in",  date: "2026-02-12", source: "match_fee" },
  { id: "kt5",  label: "Match Fees (Feb 7)",  amount: 60,  type: "in",  date: "2026-02-07", source: "match_fee" },
  { id: "kt6",  label: "Match Fees (Jan 29)", amount: 84,  type: "in",  date: "2026-01-29", source: "match_fee" },
  // Expenses
  { id: "kt7",  label: "New Bibs",              amount: 45, type: "out", date: "2026-03-03", source: "expense" },
  { id: "kt8",  label: "Pitch Booking (Mar 5)", amount: 30, type: "out", date: "2026-03-01", source: "expense" },
  { id: "kt9",  label: "Pitch Booking (Feb 28)",amount: 35, type: "out", date: "2026-02-26", source: "expense" },
  { id: "kt10", label: "Pitch Booking (Feb 19)",amount: 30, type: "out", date: "2026-02-17", source: "expense" },
  { id: "kt11", label: "Pitch Booking (Feb 12)",amount: 30, type: "out", date: "2026-02-10", source: "expense" },
  { id: "kt12", label: "Pitch Booking (Feb 7)", amount: 35, type: "out", date: "2026-02-05", source: "expense" },
  { id: "kt13", label: "Pitch Booking (Jan 29)",amount: 30, type: "out", date: "2026-01-27", source: "expense" },
  { id: "kt14", label: "First Aid Kit",         amount: 18, type: "out", date: "2026-01-20", source: "expense" },
  // Fine contributions (paid fines flow into kitty)
  { id: "kt15", label: "Late fine",             amount: 2,  type: "in", date: "2026-03-05", source: "fine", player_name: "Sam Okafor" },
  { id: "kt16", label: "Nutmegged fine",        amount: 3,  type: "in", date: "2026-02-28", source: "fine", player_name: "Jake Thornton" },
  { id: "kt17", label: "Terrible haircut fine", amount: 2,  type: "in", date: "2026-02-28", source: "fine", player_name: "Kai Brennan" },
  { id: "kt18", label: "Late fine",             amount: 2,  type: "in", date: "2026-02-28", source: "fine", player_name: "Ryan Choi" },
  { id: "kt19", label: "Missed sitter fine",    amount: 3,  type: "in", date: "2026-02-28", source: "fine", player_name: "Marcus Reid" },
  { id: "kt20", label: "Stepovers fine",        amount: 2,  type: "in", date: "2026-02-19", source: "fine", player_name: "Tom Ashford" },
  { id: "kt21", label: "Missed sitter fine",    amount: 3,  type: "in", date: "2026-02-19", source: "fine", player_name: "Finn Gallagher" },
  { id: "kt22", label: "Forgot balls fine",     amount: 5,  type: "in", date: "2026-02-19", source: "fine", player_name: "Leo Vasquez" },
  { id: "kt23", label: "Late fine",             amount: 2,  type: "in", date: "2026-02-12", source: "fine", player_name: "Zach Ellis" },
  { id: "kt24", label: "Nutmegged fine",        amount: 3,  type: "in", date: "2026-02-12", source: "fine", player_name: "Ben Kowalski" },
  { id: "kt25", label: "Terrible haircut fine", amount: 2,  type: "in", date: "2026-02-12", source: "fine", player_name: "Omar Syed" },
  { id: "kt26", label: "Hungover fine",         amount: 10, type: "in", date: "2026-02-07", source: "fine", player_name: "Kai Brennan" },
  { id: "kt27", label: "Missed sitter fine",    amount: 3,  type: "in", date: "2026-02-07", source: "fine", player_name: "Tom Ashford" },
  { id: "kt28", label: "Forgot balls fine",     amount: 5,  type: "in", date: "2026-02-07", source: "fine", player_name: "Nate Pearson" },
  { id: "kt29", label: "Late fine",             amount: 2,  type: "in", date: "2026-01-29", source: "fine", player_name: "Will Harper" },
  { id: "kt30", label: "VAR complaint fine",    amount: 2,  type: "in", date: "2026-01-29", source: "fine", player_name: "Callum Brooks" },
  { id: "kt31", label: "Own goal fine",         amount: 5,  type: "in", date: "2026-01-29", source: "fine", player_name: "Finn Gallagher" },
];

// Kitty balance = sum in - sum out
export const KITTY_BALANCE = (() => {
  const totalIn = DUMMY_KITTY_TRANSACTIONS.filter(t => t.type === "in").reduce((s, t) => s + t.amount, 0);
  const totalOut = DUMMY_KITTY_TRANSACTIONS.filter(t => t.type === "out").reduce((s, t) => s + t.amount, 0);
  return totalIn - totalOut;
})();

// ── Player Contributions ──
export const DUMMY_CONTRIBUTIONS: DummyContribution[] = [
  // Marcus Reid – 3 matches paid + 1 fine
  { name: "Marcus Reid",    amount: 18, source: "voluntary" },
  { name: "Marcus Reid",    amount: 3,  source: "fine", label: "Missed sitter" },
  // Jake Thornton – 3 matches + 2 fines
  { name: "Jake Thornton",  amount: 18, source: "voluntary" },
  { name: "Jake Thornton",  amount: 3,  source: "fine", label: "Nutmegged" },
  { name: "Jake Thornton",  amount: 2,  source: "fine", label: "Too many stepovers" },
  // Leo Vasquez – 3 matches + 2 fines
  { name: "Leo Vasquez",    amount: 18, source: "voluntary" },
  { name: "Leo Vasquez",    amount: 10, source: "fine", label: "Hungover" },
  { name: "Leo Vasquez",    amount: 5,  source: "fine", label: "Forgot the balls" },
  // Sam Okafor – 3 matches + 2 fines
  { name: "Sam Okafor",     amount: 18, source: "voluntary" },
  { name: "Sam Okafor",     amount: 2,  source: "fine", label: "Late to match" },
  { name: "Sam Okafor",     amount: 3,  source: "fine", label: "Wrong boots" },
  // Dan Mitchell – 3 matches + 1 fine
  { name: "Dan Mitchell",   amount: 18, source: "voluntary" },
  { name: "Dan Mitchell",   amount: 5,  source: "fine", label: "Forgot bibs" },
  // Kai Brennan – 3 matches + 2 fines
  { name: "Kai Brennan",    amount: 18, source: "voluntary" },
  { name: "Kai Brennan",    amount: 2,  source: "fine", label: "Terrible haircut" },
  { name: "Kai Brennan",    amount: 10, source: "fine", label: "Hungover" },
  // Tom Ashford – 2 matches + 2 fines
  { name: "Tom Ashford",    amount: 12, source: "voluntary" },
  { name: "Tom Ashford",    amount: 2,  source: "fine", label: "Too many stepovers" },
  { name: "Tom Ashford",    amount: 3,  source: "fine", label: "Missed sitter" },
  // Ryan Choi – 2 matches + 2 fines
  { name: "Ryan Choi",      amount: 12, source: "voluntary" },
  { name: "Ryan Choi",      amount: 5,  source: "fine", label: "Own goal" },
  { name: "Ryan Choi",      amount: 2,  source: "fine", label: "Late to match" },
  // Finn Gallagher – 2 matches + 2 fines
  { name: "Finn Gallagher", amount: 12, source: "voluntary" },
  { name: "Finn Gallagher", amount: 3,  source: "fine", label: "Missed sitter" },
  { name: "Finn Gallagher", amount: 5,  source: "fine", label: "Own goal" },
  // Nate Pearson – 3 matches + 2 fines
  { name: "Nate Pearson",   amount: 18, source: "voluntary" },
  { name: "Nate Pearson",   amount: 2,  source: "fine", label: "VAR complaint" },
  { name: "Nate Pearson",   amount: 5,  source: "fine", label: "Forgot the balls" },
  // Will Harper – 1 match + 1 fine
  { name: "Will Harper",    amount: 6,  source: "voluntary" },
  { name: "Will Harper",    amount: 2,  source: "fine", label: "Late to match" },
  // Zach Ellis – 1 fine
  { name: "Zach Ellis",     amount: 2,  source: "fine", label: "Late to match" },
  // Ben Kowalski – 1 fine
  { name: "Ben Kowalski",   amount: 3,  source: "fine", label: "Nutmegged" },
  // Omar Syed – 1 fine
  { name: "Omar Syed",      amount: 2,  source: "fine", label: "Terrible haircut" },
  // Callum Brooks – 1 fine
  { name: "Callum Brooks",  amount: 2,  source: "fine", label: "VAR complaint" },
];

// ── Bib Washer History (6 weeks) ──
export const DUMMY_BIB_HISTORY: DummyBibHistory[] = [
  { id: "bh1", player_name: "Ryan Choi",      player_initials: "RC", week: "Week 6", date: "2026-03-05" },
  { id: "bh2", player_name: "Sam Okafor",     player_initials: "SO", week: "Week 5", date: "2026-02-28" },
  { id: "bh3", player_name: "Tom Ashford",    player_initials: "TA", week: "Week 4", date: "2026-02-19" },
  { id: "bh4", player_name: "Kai Brennan",    player_initials: "KB", week: "Week 3", date: "2026-02-12" },
  { id: "bh5", player_name: "Leo Vasquez",    player_initials: "LV", week: "Week 2", date: "2026-02-07" },
  { id: "bh6", player_name: "Finn Gallagher", player_initials: "FG", week: "Week 1", date: "2026-01-29" },
];

// ── Notifications ──
export const DUMMY_NOTIFICATIONS: DummyNotification[] = [
  { id: "n1",  type: "match_invite",      title: "🤖 Auto Captain",   message: "New match: Thursday Night Football — Secure your spot!",                 created_at: "2026-03-08T12:00:00Z", read: false },
  { id: "n2",  type: "match_joined",      title: "Player Joined",     message: "Leo Vasquez secured a spot for Thursday",                                created_at: "2026-03-08T10:30:00Z", read: false },
  { id: "n3",  type: "reminder",          title: "🤖 Reminder",       message: "Thursday's match is in 4 days — 4 spots left!",                          created_at: "2026-03-08T10:00:00Z", read: false },
  { id: "n4",  type: "payment_reminder",  title: "🤖 Payment Due",    message: "You've joined Thursday but haven't paid £6 yet",                         created_at: "2026-03-08T09:00:00Z", read: false },
  { id: "n5",  type: "fine_issued",       title: "Fine Issued",       message: "Ryan Choi fined £5 for Own goal ⚽ → Social Kitty",                       created_at: "2026-03-05T21:00:00Z", read: true },
  { id: "n6",  type: "auto_draft",        title: "🤖 Auto Draft",     message: "Roster full! Teams auto-generated for Thursday Night Football",           created_at: "2026-03-05T18:30:00Z", read: true },
  { id: "n7",  type: "bib_washer",        title: "Bib Washer",        message: "Ryan Choi is on bib duty this week 👕",                                   created_at: "2026-03-05T21:15:00Z", read: true },
  { id: "n8",  type: "match_full",        title: "Match Full",        message: "Thursday Night Football is now full (14/14)",                              created_at: "2026-03-04T14:00:00Z", read: true },
  { id: "n9",  type: "spot_open",         title: "🤖 Spot Open!",     message: "Will Harper dropped out — 1 spot available for Thursday!",                created_at: "2026-03-04T10:00:00Z", read: true },
  { id: "n10", type: "late_fine",         title: "🤖 Late Fine",      message: "Finn Gallagher auto-fined £2 for late payment → Social Kitty",            created_at: "2026-03-03T20:00:00Z", read: true },
  { id: "n11", type: "match_recap",       title: "🤖 Match Recap",    message: "Thursday Night Football recap: Top scorer Marcus Reid (3) 🏆",             created_at: "2026-03-05T22:00:00Z", read: true },
  { id: "n12", type: "poll_created",      title: "New Poll",          message: "Vote: End of season social — what are we doing?",                          created_at: "2026-03-03T12:00:00Z", read: true },
  { id: "n13", type: "kitty_winner",      title: "Wheel Winner",      message: "Activity Roulette landed on Go-Karting! 🏎️",                              created_at: "2026-03-01T20:00:00Z", read: true },
  { id: "n14", type: "fine_issued",       title: "Fine Issued",       message: "Leo Vasquez fined £10 for Turned up hungover 🍺 → Social Kitty",           created_at: "2026-02-28T21:00:00Z", read: true },
  { id: "n15", type: "match_recap",       title: "🤖 Match Recap",    message: "Cup Semi-Final recap: 5 fines issued, £20 to the kitty 💰",                created_at: "2026-02-28T22:00:00Z", read: true },
];
