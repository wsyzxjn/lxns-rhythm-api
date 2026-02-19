import type { KyInstance } from "ky";
import { ChunithmPersonalApi } from "../chunithm/personal-api.js";
import { MaimaiPersonalApi } from "../maimai/personal-api.js";
import { OAuthUserApi } from "./user.js";

export type OAuthAuthorizeCodeTokenRequest =
  | {
      client_id: string;
      code: string;
      redirect_uri: string;
      client_secret: string;
      code_verifier?: never;
    }
  | {
      client_id: string;
      code: string;
      redirect_uri: string;
      code_verifier: string;
      client_secret?: never;
    };

export interface OAuthRefreshTokenRequest {
  /** OAuth 应用 ID */
  client_id: string;
  /** refresh_token */
  refresh_token: string;
  /** 机密客户端可传，PKCE 可省略 */
  client_secret?: string;
}

export interface OAuthTokenResponse {
  /** 访问令牌 */
  access_token: string;
  /** 令牌类型（通常为 Bearer） */
  token_type: string;
  /** access_token 过期时间（秒） */
  expires_in: number;
  /** 刷新令牌 */
  refresh_token: string;
  /** 授权范围（空格分隔） */
  scope: string;
}

export interface OAuthAuthorizeURLParams {
  /** OAuth 应用 ID */
  client_id: string;
  /** 回调地址，必须与应用配置一致 */
  redirect_uri: string;
  /** 权限范围，数组会自动以空格拼接 */
  scope: OAuthScope | OAuthScope[];
  /** 可选状态参数，用于防 CSRF 或携带上下文 */
  state?: string;
  /** PKCE 的 code_challenge（公共客户端推荐） */
  code_challenge?: string;
  /** PKCE 挑战方式，目前固定为 S256 */
  code_challenge_method?: "S256";
}

/**
 * OAuth scope。
 * 提供常用 scope 的字面量补全，同时保留 string 扩展以兼容未来新增 scope。
 */
export type OAuthScope =
  | "read_user_profile"
  | "read_user_token"
  | "read_player"
  | "write_player"
  | (string & {});

/**
 * OAuth access_token 绑定后的 API 客户端。
 * 使用 Bearer Token 访问用户信息和各游戏 personal 接口。
 */
export class OAuthAuthorizedApi {
  /** GET /api/v0/user/profile 与 GET /api/v0/user/token */
  public readonly user: OAuthUserApi;
  /** OAuth 授权后可访问的 maimai personal API */
  public readonly maimai: MaimaiPersonalApi;
  /** OAuth 授权后可访问的 chunithm personal API */
  public readonly chunithm: ChunithmPersonalApi;

  constructor(
    userHttp: KyInstance,
    maimaiHttp: KyInstance,
    chunithmHttp: KyInstance,
  ) {
    this.user = new OAuthUserApi(userHttp);
    this.maimai = new MaimaiPersonalApi(maimaiHttp);
    this.chunithm = new ChunithmPersonalApi(chunithmHttp);
  }
}
