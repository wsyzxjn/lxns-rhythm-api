import type * as Models from "../models.js";

export interface SongList {
  songs: Models.Song[];
  genres: Models.Genre[];
  versions: Models.Version[];
}

export type SongInfo = Models.Song;

export interface AliasList {
  aliases: Models.Alias[];
}

export type CollectionList = Partial<
  Record<"trophies" | "characters" | "plates" | "icons", Models.Collection[]>
>;

export type CollectionInfo = Models.Collection;

export interface YearInReview {
  game: string;
  year: number;
  latest_version: number;
  player_name: string;
  player_avatar_id: number;
  [key: string]: unknown;
}
