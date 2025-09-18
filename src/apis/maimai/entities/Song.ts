import { type Song as SongModel, LevelIndex } from "../models.js";

const LevelArray = [
  "basic",
  "advanced",
  "expert",
  "master",
  "remaster",
] as const;

function convertDifficulty<T extends { difficulty: LevelIndex }>(
  difficulty: T[]
) {
  return difficulty.reduce(
    (acc, cur) => {
      acc[LevelArray[cur.difficulty]] = cur;
      return acc;
    },
    {} as Record<(typeof LevelArray)[number], T>
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
    if (!this.difficulties.utage) return null;

    return convertDifficulty(this.difficulties.utage);
  }
}
