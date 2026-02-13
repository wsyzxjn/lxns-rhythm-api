export interface Notes {
  total: number;
  tap: number;
  hold: number;
  slide: number;
  air: number;
  flick: number;
}

export enum LevelIndex {
  BASIC = 0,
  ADVANCED = 1,
  EXPERT = 2,
  MASTER = 3,
  ULTIMA = 4,
  WORLDS_END = 5,
}

export interface ClassEmblem {
  base: number;
  medal: number;
}

export type ClearType =
  | "catastrophy"
  | "absolute"
  | "brave"
  | "hard"
  | "clear"
  | "failed";

export type RankType =
  | "sssp"
  | "sss"
  | "ssp"
  | "ss"
  | "sp"
  | "s"
  | "aaa"
  | "aa"
  | "a"
  | "bbb"
  | "bb"
  | "b"
  | "c"
  | "d";

export type FullComboType = "alljusticecritical" | "alljustice" | "fullcombo";

export type FullChainType = "fullchain" | "fullchain2";

export type TrophyColor =
  | "normal"
  | "copper"
  | "silver"
  | "gold"
  | "platinum"
  | "rainbow"
  | "image";

// 文档中 SongType 仅作为模型引用，未给出完整枚举。
export type SongType = string;

export interface SongDifficulty {
  difficulty: LevelIndex;
  level: string;
  level_value: number;
  note_designer: string;
  version: number;
  notes?: Notes;
  origin_id?: number;
  kanji?: string;
  star?: number;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  map?: string;
  version: number;
  rights?: string;
  disabled?: boolean;
  locked?: boolean;
  difficulties: SongDifficulty[];
  aliases?: string[];
}

export interface Genre {
  id: number;
  genre: string;
}

export interface Version {
  id: number;
  title: string;
  version: number;
}

export interface Alias {
  song_id: number;
  aliases: string[];
}

export interface Player {
  name: string;
  level: number;
  rating: number;
  rating_possession: string;
  friend_code: number;
  class_emblem: ClassEmblem;
  reborn_count: number;
  over_power: number;
  over_power_progress: number;
  currency: number;
  total_currency: number;
  total_play_count: number;
  team?: Team;
  trophy?: Trophy;
  character?: Character;
  name_plate?: NamePlate;
  map_icon?: MapIcon;
  upload_time?: string;
}

export interface Team {
  id: number;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  color?: TrophyColor;
  level?: number;
  required?: CollectionRequired[];
}

export interface CollectionRequired {
  difficulties?: LevelIndex[];
  rank?: RankType;
  clear?: ClearType;
  full_combo?: FullComboType;
  full_chain?: FullChainType;
  songs?: CollectionRequiredSong[];
  completed?: boolean;
}

export interface CollectionRequiredSong {
  id: number;
  title: string;
  type: SongType;
  completed?: boolean;
  completed_difficulties?: LevelIndex[];
}

export interface Score {
  id: number;
  song_name?: string;
  level?: string;
  level_index: LevelIndex;
  score: number;
  over_power?: number;
  clear?: ClearType;
  rank?: RankType;
  full_combo?: FullComboType;
  full_chain?: FullChainType;
  chain?: number;
  rating?: number;
  type: SongType;
  play_time?: string;
  upload_time?: string;
  last_played_time?: string;
}

export interface SimpleScore {
  id: number;
  song_name: string;
  level: string;
  level_index: LevelIndex;
  clear: ClearType;
  rank: RankType;
  full_combo?: FullComboType;
  full_chain?: FullChainType;
  type: SongType;
}

export interface RatingTrend {
  rating: number;
  bests_rating: number;
  selections_rating: number;
  recents_rating?: number;
  new_bests_rating?: number;
  date: string;
}

export interface Trophy extends Collection {}
export interface Character extends Collection {}
export interface NamePlate extends Collection {}
export interface MapIcon extends Collection {}

export type AssetType =
  | "character"
  | "trophy"
  | "plate"
  | "icon"
  | "jacket"
  | "music";
