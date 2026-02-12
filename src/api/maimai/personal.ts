import type { KyInstance } from "ky";
import type { Score } from "./models.js";
import type * as Personal from "./types/personal.js";

/**
 * maimai 个人 API（需用户身份，路径遵循文档）
 */
export class MaimaiPersonalApi {
  constructor(public readonly http: KyInstance) {}

  /**
   * 获取玩家信息
   * GET /api/v0/user/maimai/player
   * @returns PlayerInfo
   */
  async getPlayer() {
    return this.http.get("player").json<Personal.PlayerInfo>();
  }

  /**
   * 获取玩家所有成绩
   * GET /api/v0/user/maimai/player/scores
   * @returns PlayerScores
   */
  async getScores() {
    return this.http.get("scores").json<Personal.PlayerScores>();
  }

  /**
   * 上传玩家成绩
   * POST /api/v0/user/maimai/player/scores
   * @param scores 成绩列表
   * @returns 上传结果
   */
  async postScores(scores: Score[]) {
    const body: Personal.PostScoresRequest = { scores };
    return this.http
      .post("scores", { json: body })
      .json<Personal.PostScoresResponse>();
  }
}
