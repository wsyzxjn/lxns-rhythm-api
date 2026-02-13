import type * as Models from "../models.js";

export type PlayerInfo = Models.Player;

export interface Bests {
  bests: Models.Score[];
  selections: Models.Score[];
  new_bests: Models.Score[];
}

export type BestScore = Models.Score;

export type RecentList = Models.Score[];

export type BestScoreList = Models.SimpleScore[];

export type Heatmap = Record<string, number>;

export type TrendList = Models.RatingTrend[];

export type ScoreHistory = Models.Score[];

export type CollectionProgress = Models.Collection;

export interface PostScoresRequest {
  scores: Models.Score[];
}

export type PostScoresResponse = unknown;

export type PostHtmlResponse = unknown;
