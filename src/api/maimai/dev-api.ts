import type { KyInstance } from "ky";
import type { Player, Score } from "./models.js";
import type * as Dev from "./types/dev-types.js";

/**
 * maimai 开发者 API（路径风格，与文档一致，不使用查询参数）
 */
export class MaimaiDevApi {
  constructor(public readonly http: KyInstance) {}

  /**
   * 创建或修改玩家信息
   * @param body 玩家信息
   * @returns 玩家信息
   */
  async postPlayer(body: Player) {
    return this.http.post("player", { json: body }).json<Dev.PlayerInfo>();
  }

  /**
   * 获取玩家信息（通过好友码）
   * @param friendCode 好友码
   * @returns 玩家信息
   */
  async getPlayer(friendCode: number) {
    return this.http.get(`player/${friendCode}`).json<Dev.PlayerInfo>();
  }

  /**
   * 获取玩家信息（通过 QQ 号）
   * @param qq QQ 号
   * @returns 玩家信息
   */
  async getPlayerByQQ(qq: number) {
    return this.http.get(`player/qq/${qq}`).json<Dev.PlayerInfo>();
  }

  /**
   * 获取 Best 50（standard 35 + dx 15）
   * @param friendCode 好友码
   * @returns Best 50
   */
  async getBests(friendCode: number) {
    return this.http.get(`player/${friendCode}/bests`).json<Dev.Bests>();
  }

  /**
   * 获取 AP 50
   * @param friendCode 好友码
   * @returns AP 50
   */
  async getApBests(friendCode: number) {
    return this.http.get(`player/${friendCode}/bests/ap`).json<Dev.ApBests>();
  }

  /**
   * 获取 Recent 50（仅增量爬取可用）
   * @param friendCode 好友码
   * @returns Recent 50
   */
  async getRecents(friendCode: number) {
    return this.http.get(`player/${friendCode}/recents`).json<Dev.RecentList>();
  }

  /**
   * 获取玩家缓存的所有最佳成绩（简化）
   * @param friendCode 好友码
   * @returns BestScoreList
   */
  async getAllBestScores(friendCode: number) {
    return this.http
      .get(`player/${friendCode}/scores`)
      .json<Dev.BestScoreList>();
  }

  /**
   * 成绩上传热力图（YYYY-MM-DD -> 数量）
   * @param friendCode 好友码
   * @returns Heatmap
   */
  async getHeatmap(friendCode: number) {
    return this.http.get(`player/${friendCode}/heatmap`).json<Dev.Heatmap>();
  }

  /**
   * DX Rating 趋势
   * @param friendCode 好友码
   * @returns TrendList
   */
  async getTrend(friendCode: number) {
    return this.http.get(`player/${friendCode}/trend`).json<Dev.TrendList>();
  }

  /**
   * 成绩游玩历史记录（仅返回带有 play_time 的成绩）
   * @param friendCode 好友码
   * @returns 游玩历史记录
   */
  async getScoreHistory(friendCode: number) {
    return this.http
      .get(`player/${friendCode}/score/history`)
      .json<Dev.ScoreHistory>();
  }

  /**
   * 获取玩家收藏品进度
   * @param friendCode 好友码
   * @param collectionType 收藏品类型
   * @param collectionId 收藏品 ID
   * @returns 收藏品进度
   */
  async getCollectionProgress(
    friendCode: number,
    collectionType: "trophy" | "icon" | "plate" | "frame",
    collectionId: number,
  ) {
    return this.http
      .get(`player/${friendCode}/${collectionType}/${collectionId}`)
      .json<Dev.CollectionProgress>();
  }

  /**
   * 上传玩家成绩
   * @param friendCode 好友码
   * @param scores 成绩列表
   * @returns 上传结果
   */
  async postScores(friendCode: number, scores: Score[]) {
    const body: Dev.PostScoresRequest = { scores };
    return this.http
      .post(`player/${friendCode}/scores`, { json: body })
      .json<Dev.PostScoresResponse>();
  }

  /**
   * 通过 NET 的 HTML 源代码上传玩家数据
   * @param friendCode 好友码
   * @param htmlSource HTML 源代码
   * @returns 上传结果
   */
  async postHtml(friendCode: number, htmlSource: string) {
    return this.http
      .post(`player/${friendCode}/html`, {
        body: htmlSource,
        headers: { "content-type": "text/plain" },
      })
      .json<Dev.PostHtmlResponse>();
  }
}
