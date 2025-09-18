import type * as Models from "../models.js";

// SongList 类型
export interface SongList {
  songs: Models.Song[];
  genres: Models.Genre[];
  versions: Models.Version[];
}

// SongInfo 类型
export type SongInfo = Models.Song;

// AliasList 类型
export interface AliasList {
  aliases: Models.Alias[];
}

// CollectionList 类型（根据 collection_type 返回不同字段）
export type CollectionList = Partial<
  Record<"trophies" | "icons" | "plates" | "frames", Models.Collection[]>
>;

// CollectionInfo 类型
export type CollectionInfo = Models.Collection;

// CollectionGenre 列表
export interface CollectionGenreList {
  collectionGenres: Models.CollectionGenre[];
}

// CollectionGenre 信息
export type CollectionGenreInfo = Models.CollectionGenre;
