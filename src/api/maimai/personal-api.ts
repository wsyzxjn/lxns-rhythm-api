import type { KyInstance } from "ky";
import type { Score } from "./models.js";
import type * as Personal from "./types/personal-types.js";

function scoreSearchParams(options?: Personal.ScoreQuery) {
  const params = new URLSearchParams();

  if (options?.songId !== undefined) {
    params.set("song_id", String(options.songId));
  }
  if (options?.songType !== undefined) {
    params.set("song_type", options.songType);
  }
  if (options?.levelIndex !== undefined) {
    params.set("level_index", String(options.levelIndex));
  }

  return params;
}

function aliasListSearchParams(options?: Personal.AliasListOptions) {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.set("page", String(options.page));
  }
  if (options?.sort !== undefined) {
    params.set("sort", options.sort);
  }
  if (options?.approved !== undefined) {
    params.set("approved", String(options.approved));
  }
  if (options?.songId !== undefined) {
    params.set("song_id", String(options.songId));
  }

  return params;
}

function commentSearchParams(options: Personal.CommentQuery) {
  const params = new URLSearchParams({
    song_id: String(options.songId),
    level_index: String(options.levelIndex),
  });

  if (options.songType !== undefined) {
    params.set("song_type", options.songType);
  }

  return params;
}

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
   * 更新玩家信息
   * PUT /api/v0/user/maimai/player
   */
  async updatePlayer(player: Personal.PlayerUpdate) {
    return this.http
      .put("player", { json: player })
      .json<Personal.PlayerInfo>();
  }

  /**
   * 解绑玩家信息
   * DELETE /api/v0/user/maimai/player
   */
  async deletePlayer() {
    return this.http.delete("player").json<Personal.MutationResponse>();
  }

  /**
   * 获取玩家所有成绩
   * GET /api/v0/user/maimai/player/scores
   * @returns PlayerScores
   */
  async getScores() {
    return this.http.get("player/scores").json<Personal.PlayerScores>();
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
      .post("player/scores", { json: body })
      .json<Personal.PostScoresResponse>();
  }

  /**
   * 删除玩家成绩。不传参数时删除全部成绩，传参数时删除匹配的历史成绩。
   * DELETE /api/v0/user/maimai/player/scores
   */
  async deleteScores(options?: Personal.ScoreQuery) {
    return this.http
      .delete("player/scores", { searchParams: scoreSearchParams(options) })
      .json<Personal.MutationResponse>();
  }

  /**
   * 删除单条最佳成绩
   * DELETE /api/v0/user/maimai/player/score
   */
  async deleteScore(options: Personal.ScoreKey) {
    return this.http
      .delete("player/score", { searchParams: scoreSearchParams(options) })
      .json<Personal.MutationResponse>();
  }

  /**
   * 获取玩家 Best 成绩。传 songId 时返回指定曲目的最佳成绩列表。
   * GET /api/v0/user/maimai/player/bests
   */
  async getBests(): Promise<Personal.Bests>;
  async getBests(options: Personal.ScoreQuery): Promise<Personal.PlayerScores>;
  async getBests(options?: Personal.ScoreQuery) {
    return this.http
      .get("player/bests", { searchParams: scoreSearchParams(options) })
      .json<Personal.Bests | Personal.PlayerScores>();
  }

  /**
   * 获取单谱面成绩排行
   * GET /api/v0/user/maimai/player/score/ranking
   */
  async getScoreRanking(options: Personal.ScoreKey) {
    return this.http
      .get("player/score/ranking", { searchParams: scoreSearchParams(options) })
      .json<Personal.RankingScore[]>();
  }

  /**
   * 获取单谱面成绩历史
   * GET /api/v0/user/maimai/player/score/history
   */
  async getScoreHistory(options: Personal.ScoreKey) {
    return this.http
      .get("player/score/history", { searchParams: scoreSearchParams(options) })
      .json<Personal.ScoreHistory>();
  }

  /**
   * 获取成绩上传热力图
   * GET /api/v0/user/maimai/player/heatmap
   */
  async getHeatmap() {
    return this.http.get("player/heatmap").json<Personal.Heatmap>();
  }

  /**
   * 获取 DX Rating 趋势
   * GET /api/v0/user/maimai/player/trend
   */
  async getTrend(version?: number) {
    return this.http
      .get("player/trend", { searchParams: { version } })
      .json<Personal.RatingTrend[]>();
  }

  /**
   * 获取玩家已获得的收藏品列表
   * GET /api/v0/user/maimai/player/{collectionType}
   */
  async getPlayerCollectionList(
    collectionType: Personal.PlayerCollectionListType,
  ) {
    return this.http
      .get(`player/${collectionType}`)
      .json<Personal.PlayerCollectionList>();
  }

  /**
   * 获取玩家收藏品进度
   * GET /api/v0/user/maimai/player/{collectionType}/{id}
   */
  async getPlayerCollection(
    collectionType: Personal.PlayerCollectionType,
    id: number,
  ) {
    return this.http
      .get(`player/${collectionType}/${id}`)
      .json<Personal.PlayerCollection>();
  }

  /**
   * 通过 NET 的 HTML 源代码同步玩家数据
   * POST /api/v0/user/maimai/player/html
   */
  async postHtml(htmlSource: string) {
    return this.http
      .post("player/html", {
        body: htmlSource,
        headers: { "content-type": "text/plain" },
      })
      .json<Personal.MutationResponse>();
  }

  /**
   * 导出玩家成绩
   * GET /api/v0/user/maimai/player/scores/export/{type}
   */
  async exportScores(type: Personal.ScoreExportType = "csv") {
    return new Uint8Array(
      await this.http.get(`player/scores/export/${type}`).arrayBuffer(),
    );
  }

  /**
   * 导入玩家成绩
   * POST /api/v0/user/maimai/player/scores/import
   */
  async importScores(file: Blob, fileName?: string) {
    const body = new FormData();
    if (fileName) {
      body.append("file", file, fileName);
    } else {
      body.append("file", file);
    }

    return this.http
      .post("player/scores/import", { body })
      .json<Personal.MutationResponse>();
  }

  /**
   * 获取玩家年度总结
   * GET /api/v0/user/maimai/player/year-in-review/{year}
   */
  async getYearInReview(year: number, options?: { agree?: boolean }) {
    return this.http
      .get(`player/year-in-review/${year}`, { searchParams: { ...options } })
      .json<Personal.YearInReview>();
  }

  /**
   * 生成年度总结分享链接
   * POST /api/v0/user/maimai/player/year-in-review/{year}/share
   */
  async createYearInReviewShare(
    year: number,
    body: Personal.CreateYearInReviewShareRequest = { public: true },
  ) {
    return this.http
      .post(`player/year-in-review/${year}/share`, { json: body })
      .json<Personal.YearInReviewShare>();
  }

  /**
   * 获取游戏个人配置
   * GET /api/v0/user/maimai/config
   */
  async getConfig() {
    return this.http.get("config").json<Personal.UserConfig>();
  }

  /**
   * 更新游戏个人配置
   * POST /api/v0/user/maimai/config
   */
  async updateConfig(config: Personal.UserConfigUpdate) {
    return this.http
      .post("config", { json: config })
      .json<Personal.UserConfig>();
  }

  /**
   * 获取登录用户可见的别名列表
   * GET /api/v0/user/maimai/alias/list
   */
  async getAliasList(options?: Personal.AliasListOptions) {
    return this.http
      .get("alias/list", { searchParams: aliasListSearchParams(options) })
      .json<Personal.AliasList>();
  }

  /**
   * 获取登录用户的别名投票记录
   * GET /api/v0/user/maimai/alias/votes
   */
  async getAliasVotes() {
    return this.http.get("alias/votes").json<Personal.AliasVote[]>();
  }

  /**
   * 创建曲目别名
   * POST /api/v0/user/maimai/alias
   */
  async createAlias(body: Personal.CreateAliasRequest) {
    return this.http
      .post("alias", { json: body })
      .json<Personal.MutationResponse>();
  }

  /**
   * 为曲目别名投票
   * POST /api/v0/user/maimai/alias/{aliasId}/vote/{up|down}
   */
  async voteAlias(aliasId: number, vote: "up" | "down" | boolean) {
    const direction = typeof vote === "boolean" ? (vote ? "up" : "down") : vote;
    return this.http
      .post(`alias/${aliasId}/vote/${direction}`)
      .json<Personal.MutationResponse>();
  }

  /**
   * 删除当前用户创建的曲目别名
   * DELETE /api/v0/user/maimai/alias/{aliasId}
   */
  async deleteAlias(aliasId: number) {
    return this.http
      .delete(`alias/${aliasId}`)
      .json<Personal.MutationResponse>();
  }

  /**
   * 获取谱面评论
   * GET /api/v0/user/maimai/comment/list
   */
  async getComments(options: Personal.CommentQuery) {
    return this.http
      .get("comment/list", { searchParams: commentSearchParams(options) })
      .json<Personal.Comment[]>();
  }

  /**
   * 创建或更新谱面评论
   * POST /api/v0/user/maimai/comment
   */
  async createComment(body: Personal.CreateCommentRequest) {
    return this.http
      .post("comment", { json: body })
      .json<Personal.MutationResponse>();
  }

  /**
   * 删除谱面评论
   * DELETE /api/v0/user/maimai/comment/{commentId}
   */
  async deleteComment(commentId: number) {
    return this.http
      .delete(`comment/${commentId}`)
      .json<Personal.MutationResponse>();
  }

  /**
   * 点赞谱面评论
   * POST /api/v0/user/maimai/comment/{commentId}/like
   */
  async likeComment(commentId: number) {
    return this.http
      .post(`comment/${commentId}/like`)
      .json<Personal.MutationResponse>();
  }

  /**
   * 取消点赞谱面评论
   * DELETE /api/v0/user/maimai/comment/{commentId}/like
   */
  async unlikeComment(commentId: number) {
    return this.http
      .delete(`comment/${commentId}/like`)
      .json<Personal.MutationResponse>();
  }
}
