import type { KyInstance } from "ky";
import type { LevelIndex, Player, Score } from "./models.js";
import type * as Dev from "./types/dev-types.js";

/**
 * chunithm 开发者 API
 */
export class ChunithmDevApi {
  constructor(public readonly http: KyInstance) {}

  /**
   * 创建或修改玩家信息
   */
  async postPlayer(body: Player) {
    return this.http.post("player", { json: body }).json<Dev.PlayerInfo>();
  }

  /**
   * 获取玩家信息（通过好友码）
   */
  async getPlayer(friendCode: number) {
    return this.http.get(`player/${friendCode}`).json<Dev.PlayerInfo>();
  }

  /**
   * 获取玩家信息（通过 QQ 号）
   */
  async getPlayerByQQ(qq: number) {
    return this.http.get(`player/qq/${qq}`).json<Dev.PlayerInfo>();
  }

  /**
   * 获取 Best 30（old 15 + new 15）
   */
  async getBests(friendCode: number) {
    return this.http.get(`player/${friendCode}/bests`).json<Dev.Bests>();
  }

  /**
   * 获取玩家缓存谱面的最佳成绩
   */
  async getBest(
    friendCode: number,
    options: { songId?: number; songName?: string; levelIndex?: LevelIndex },
  ) {
    return this.http
      .get(`player/${friendCode}/best`, {
        searchParams: {
          song_id: options.songId,
          song_name: options.songName,
          level_index: options.levelIndex,
        },
      })
      .json<Dev.BestScore>();
  }

  /**
   * 获取玩家缓存的所有最佳成绩（简化）
   */
  async getAllBestScores(friendCode: number) {
    return this.http
      .get(`player/${friendCode}/scores`)
      .json<Dev.BestScoreList>();
  }

  /**
   * 获取 Recent 50
   */
  async getRecents(friendCode: number) {
    return this.http.get(`player/${friendCode}/recents`).json<Dev.RecentList>();
  }

  /**
   * 获取成绩游玩历史记录
   */
  async getScoreHistory(
    friendCode: number,
    options?: { songId?: number; levelIndex?: LevelIndex },
  ) {
    return this.http
      .get(`player/${friendCode}/score/history`, {
        searchParams: {
          song_id: options?.songId,
          level_index: options?.levelIndex,
        },
      })
      .json<Dev.ScoreHistory>();
  }

  /**
   * 成绩上传热力图
   */
  async getHeatmap(friendCode: number) {
    return this.http.get(`player/${friendCode}/heatmap`).json<Dev.Heatmap>();
  }

  /**
   * Rating 趋势
   */
  async getTrend(friendCode: number, version?: number) {
    return this.http
      .get(`player/${friendCode}/trend`, { searchParams: { version } })
      .json<Dev.TrendList>();
  }

  /**
   * 获取玩家收藏品进度
   */
  async getCollectionProgress(
    friendCode: number,
    collectionType: "trophy" | "character" | "plate" | "icon",
    collectionId: number,
  ) {
    return this.http
      .get(`player/${friendCode}/${collectionType}/${collectionId}`)
      .json<Dev.CollectionProgress>();
  }

  /**
   * 上传玩家成绩
   */
  async postScores(friendCode: number, scores: Score[]) {
    const body: Dev.PostScoresRequest = { scores };
    return this.http
      .post(`player/${friendCode}/scores`, { json: body })
      .json<Dev.PostScoresResponse>();
  }

  /**
   * 通过 NET 的 HTML 源代码上传玩家数据
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
