import type { LevelIndex, Song as SongModel } from "../models.js";

const LevelArray = [
  "basic",
  "advanced",
  "expert",
  "master",
  "remaster",
] as const;

type DifficultyMap<T> = {
  0: T;
  1: T;
  2: T;
  3: T;
  4?: T;
  basic: T;
  advanced: T;
  expert: T;
  master: T;
  remaster?: T;
};

function convertDifficulty<T extends { difficulty: LevelIndex }>(
  difficulty: T[],
) {
  const sortedDifficulty = [...difficulty].sort(
    (a, b) => a.difficulty - b.difficulty,
  );

  return sortedDifficulty.reduce<DifficultyMap<T>>(
    (acc, cur) => {
      acc[cur.difficulty] = cur;
      acc[LevelArray[cur.difficulty]] = cur;
      return acc;
    },
    {} as DifficultyMap<T>,
  );
}

export class Song implements SongModel {
  public readonly id: SongModel["id"];
  public readonly title: SongModel["title"];
  public readonly artist: SongModel["artist"];
  public readonly genre: SongModel["genre"];
  public readonly version: SongModel["version"];
  public readonly bpm: SongModel["bpm"];
  public readonly difficulties: SongModel["difficulties"];
  public readonly locked: boolean;
  public readonly disabled: boolean;
  public readonly rights: SongModel["rights"];

  constructor(song: SongModel) {
    this.id = song.id;
    this.title = song.title;
    this.artist = song.artist;
    this.genre = song.genre;
    this.version = song.version;
    this.bpm = song.bpm;
    this.difficulties = song.difficulties;
    this.locked = song.locked ?? false;
    this.disabled = song.disabled ?? false;
    this.rights = song.rights;
  }

  get standard() {
    if (this.difficulties.standard.length === 0) return null;

    return convertDifficulty(this.difficulties.standard);
  }

  get dx() {
    if (this.difficulties.dx.length === 0) return null;

    return convertDifficulty(this.difficulties.dx);
  }

  get utage() {
    if (!this.difficulties.utage || this.difficulties.utage.length === 0) {
      return null;
    }

    return this.difficulties.utage;
  }
}
