import type { Player, Score } from "../models.js";

// Player 信息
export type PlayerInfo = Player;

// 玩家所有成绩列表
export type PlayerScores = Score[];

// 上传玩家成绩（请求体）
export interface PostScoresRequest {
  scores: Score[];
}

// 上传玩家成绩（响应体）
// 文档未给出明确结构，先给出一个通用响应结构。如有需要可根据后端返回再细化
export type PostScoresResponse = unknown;
