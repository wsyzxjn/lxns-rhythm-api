import type { Player, Score } from "../models.js";

export type PlayerInfo = Player;

export type PlayerScores = Score[];

export interface PostScoresRequest {
  scores: Score[];
}

export type PostScoresResponse = unknown;
