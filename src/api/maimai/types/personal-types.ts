import type * as Models from "../models.js";

// Player 信息
export type PlayerInfo = Models.Player;

// 更新玩家信息
export type PlayerUpdate = Partial<Models.Player>;

// 玩家所有成绩列表
export type PlayerScores = Models.Score[];

export interface Bests {
  standard: Models.Score[];
  dx: Models.Score[];
  standard_total: number;
  dx_total: number;
}

export interface ScoreQuery {
  songId?: number;
  songType?: Models.SongType;
  levelIndex?: Models.LevelIndex | number;
}

export interface ScoreKey {
  songId: number;
  songType?: Models.SongType;
  levelIndex: Models.LevelIndex | number;
}

export interface RankingScore {
  ranking: number;
  player_name?: string;
  achievements?: number;
  dx_score?: number;
  upload_time: string;
}

export type ScoreHistory = Models.Score[];

export type Heatmap = Record<string, number>;

// DX Rating 趋势
export type RatingTrend = Models.RatingTrend;

export type PlayerCollectionListType =
  | "trophies"
  | "icons"
  | "plates"
  | "frames";

export type PlayerCollectionType = "trophy" | "icon" | "plate" | "frame";

export type PlayerCollectionList = Models.Collection[];

export type PlayerCollection = Models.Collection;

export interface UserConfig {
  allow_crawl_scores?: boolean;
  allow_crawl_name_plate?: boolean;
  allow_crawl_frame?: boolean;
  allow_crawl_map_icon?: boolean;
  crawl_scores_method?: string;
  crawl_scores_difficulty?: string[];
  allow_third_party_fetch_player?: boolean;
  allow_third_party_fetch_scores?: boolean;
  allow_third_party_fetch_history?: boolean;
  allow_third_party_write_data?: boolean;
  show_player_name_in_score_ranking?: boolean;
}

export type UserConfigUpdate = Partial<UserConfig>;

export interface YearInReview {
  game: string;
  year: number;
  latest_version: number;
  player_name: string;
  player_avatar_id: number;
  [key: string]: unknown;
}

export interface CreateYearInReviewShareRequest {
  public?: boolean;
}

export interface YearInReviewShare {
  share_token: string;
  [key: string]: unknown;
}

export type ScoreExportType = "csv" | (string & {});

export interface AliasListOptions {
  page?: number;
  sort?: string;
  approved?: boolean;
  songId?: number;
}

export interface AliasList {
  aliases: Alias[];
  page_count: number;
  page_size: number;
}

export interface Alias {
  alias_id: number;
  song: {
    id: number;
    name: string;
  };
  song_type: string;
  difficulty: number;
  alias: string;
  approved: boolean;
  weight: {
    up: number;
    down: number;
    total: number;
  };
  uploader: {
    id: number;
    name: string;
  };
  upload_time: string;
  vote?: AliasVote;
}

export interface AliasVote {
  alias_id?: number;
  vote_id?: number;
  weight: number;
}

export interface CreateAliasRequest {
  song_id: number;
  alias: string;
}

export interface CommentQuery extends ScoreKey {}

export interface Comment {
  comment_id: number;
  comment?: string;
  rating?: number;
  is_liked: boolean;
  like_count: number;
  upload_time: string;
  uploader: {
    id: number;
    name: string;
    avatar_id?: number;
  };
}

export interface CreateCommentRequest {
  song_id: number;
  song_type?: Models.SongType | null;
  difficulty: Models.LevelIndex | number;
  comment?: string;
  rating?: number;
}

// 上传玩家成绩（请求体）
export interface PostScoresRequest {
  scores: Models.Score[];
}

export type MutationResponse = unknown;

export type PostScoresResponse = MutationResponse;
