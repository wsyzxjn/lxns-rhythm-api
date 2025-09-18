import type * as Models from "../models.js";

// Player 信息
export type PlayerInfo = Models.Player;

// Best 50 结果
export interface Bests {
  standard_total: number;
  dx_total: number;
  standard: Models.Score[];
  dx: Models.Score[];
}

// AP 50 结果（结构同 Best 50）
export type ApBests = Bests;

// Recent 50（增量爬取可用）
export type RecentList = Models.Score[];

// 所有最佳成绩（简化）
export type BestScoreList = Models.SimpleScore[];

// 成绩上传热力图（YYYY-MM-DD -> 数量）
export type Heatmap = Record<string, number>;

// DX Rating 趋势
export type TrendList = Models.RatingTrend[];

// 成绩游玩历史记录（仅含 play_time）
export type ScoreHistory = Models.Score[];

// 玩家收藏品进度
export type CollectionProgress = Models.Collection;

// 上传成绩
export interface PostScoresRequest {
  scores: Models.Score[];
}
export type PostScoresResponse = unknown;

// 上传 HTML 源代码
export type PostHtmlResponse = unknown;
