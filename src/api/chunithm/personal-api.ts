import type { KyInstance } from "ky";
import type { Score } from "./models.js";
import type * as Personal from "./types/personal-types.js";

/**
 * chunithm 个人 API（需用户身份）
 */
export class ChunithmPersonalApi {
  constructor(public readonly http: KyInstance) {}

  /**
   * 获取玩家信息
   * GET /api/v0/user/chunithm/player
   */
  async getPlayer() {
    return this.http.get("player").json<Personal.PlayerInfo>();
  }

  /**
   * 获取玩家所有成绩
   * GET /api/v0/user/chunithm/player/scores
   */
  async getScores() {
    return this.http.get("scores").json<Personal.PlayerScores>();
  }

  /**
   * 上传玩家成绩
   * POST /api/v0/user/chunithm/player/scores
   */
  async postScores(scores: Score[]) {
    const body: Personal.PostScoresRequest = { scores };
    return this.http
      .post("scores", { json: body })
      .json<Personal.PostScoresResponse>();
  }
}
