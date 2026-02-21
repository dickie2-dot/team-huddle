export interface Player {
  id: number;
  name: string;
  initials: string;
  avatar: string;
  confirmed: boolean;
}

export const MOCK_PLAYERS: Player[] = [
  { id: 1, name: "Marcus Reid", initials: "MR", avatar: "", confirmed: true },
  { id: 2, name: "Jake Thornton", initials: "JT", avatar: "", confirmed: true },
  { id: 3, name: "Leo Vasquez", initials: "LV", avatar: "", confirmed: true },
  { id: 4, name: "Sam Okafor", initials: "SO", avatar: "", confirmed: true },
  { id: 5, name: "Dan Mitchell", initials: "DM", avatar: "", confirmed: true },
  { id: 6, name: "Kai Brennan", initials: "KB", avatar: "", confirmed: true },
  { id: 7, name: "Tom Ashford", initials: "TA", avatar: "", confirmed: true },
  { id: 8, name: "Ryan Choi", initials: "RC", avatar: "", confirmed: true },
  { id: 9, name: "Finn Gallagher", initials: "FG", avatar: "", confirmed: true },
  { id: 10, name: "Nate Pearson", initials: "NP", avatar: "", confirmed: true },
  { id: 11, name: "Will Harper", initials: "WH", avatar: "", confirmed: false },
  { id: 12, name: "Zach Ellis", initials: "ZE", avatar: "", confirmed: false },
  { id: 13, name: "Ben Kowalski", initials: "BK", avatar: "", confirmed: false },
  { id: 14, name: "Omar Syed", initials: "OS", avatar: "", confirmed: false },
];

export const MATCH_INFO = {
  date: "Thursday, Feb 26",
  time: "7:00 PM",
  location: "Hackney Marshes Pitch 4",
  spotsTotal: 14,
};
