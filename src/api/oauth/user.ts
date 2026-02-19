import type { KyInstance } from "ky";

export interface OAuthUserProfile {
  /** 用户 ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 头像 URL */
  avatar: string;
  /** 账号角色 */
  role: string;
  /** 地区 */
  region: string;
}

export interface OAuthUserToken {
  /** 用户的个人 API 密钥 */
  token: string;
}

/**
 * OAuth 用户 API
 */
export class OAuthUserApi {
  constructor(public readonly http: KyInstance) {}

  /**
   * 获取用户基本信息
   * GET /api/v0/user/profile
   * @returns 用户基本信息
   */
  async getProfile() {
    return this.http.get("profile").json<OAuthUserProfile>();
  }

  /**
   * 获取用户个人 API 密钥
   * GET /api/v0/user/token
   * @returns 用户个人 API 密钥
   */
  async getToken() {
    return this.http.get("token").json<OAuthUserToken>();
  }
}
