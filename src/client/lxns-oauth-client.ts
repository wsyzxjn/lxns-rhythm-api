import ky, { type KyInstance } from "ky";
import type {
  OAuthAuthorizeCodeTokenRequest,
  OAuthAuthorizeURLParams,
  OAuthRefreshTokenRequest,
  OAuthTokenResponse,
} from "../api/oauth/oauth.js";
import { OAuthAuthorizedApi } from "../api/oauth/oauth.js";
import { LXNS_HTTP_OPTIONS } from "./http-options.js";

export interface LxnsOAuthClientOptions {
  /** OAuth 应用的 client_id */
  clientId: string;
  /** OAuth 回调地址，需与应用配置一致 */
  redirectURI: string;
  /** 机密客户端使用的 client_secret；PKCE 场景可不传 */
  clientSecret?: string;
  /** API 基础地址，默认 https://maimai.lxns.net/api/v0/ */
  baseURL?: string;
}

export interface OAuthAuthorizeURLOptions {
  /** 申请的权限范围 */
  scope: OAuthAuthorizeURLParams["scope"];
  /** 可选状态参数，用于防 CSRF 或携带上下文 */
  state?: string;
  /** PKCE code_challenge */
  codeChallenge?: string;
  /** PKCE 挑战方式，当前仅支持 S256 */
  codeChallengeMethod?: OAuthAuthorizeURLParams["code_challenge_method"];
}

export interface OAuthExchangeCodeOptions {
  /** OAuth 回调返回的 code */
  code: string;
  /** PKCE 场景对应的 code_verifier */
  codeVerifier?: string;
}

export interface OAuthRefreshTokenOptions {
  /** 刷新令牌 */
  refreshToken: string;
}

/**
 * Lxns OAuth 客户端。
 * 负责授权链接生成、code 换 token、refresh token，以及基于 access_token 创建授权态 API。
 */
export class LxnsOAuthClient {
  /** 当前 OAuth 客户端配置 */
  public readonly config: LxnsOAuthClientOptions & { baseURL: string };
  private readonly http: KyInstance;

  /**
   * @param config OAuth 配置
   */
  constructor(config: Readonly<LxnsOAuthClientOptions>) {
    this.config = {
      ...config,
      baseURL: config.baseURL ?? "https://maimai.lxns.net/api/v0/",
    };

    this.http = ky.create({
      prefixUrl: new URL("oauth/", this.config.baseURL),
      ...LXNS_HTTP_OPTIONS,
    });
  }

  /**
   * 生成 OAuth 授权链接（/oauth/authorize）。
   * @returns 可直接跳转的授权 URL
   */
  createAuthorizeURL({
    scope,
    state,
    codeChallenge,
    codeChallengeMethod,
  }: OAuthAuthorizeURLOptions) {
    const url = new URL("/oauth/authorize", this.config.baseURL);
    const search = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectURI,
      scope: Array.isArray(scope) ? scope.join(" ") : scope,
    });

    if (state) {
      search.set("state", state);
    }
    if (codeChallenge) {
      search.set("code_challenge", codeChallenge);
    }
    if (codeChallengeMethod) {
      search.set("code_challenge_method", codeChallengeMethod);
    }

    url.search = search.toString();
    return url.toString();
  }

  /**
   * 使用授权码换取访问令牌（grant_type=authorization_code）。
   * - 机密客户端：依赖 constructor 传入的 clientSecret
   * - PKCE 客户端：通过 codeVerifier 交换
   */
  async exchangeCodeForToken({ code, codeVerifier }: OAuthExchangeCodeOptions) {
    const payload: OAuthAuthorizeCodeTokenRequest = codeVerifier
      ? {
          client_id: this.config.clientId,
          code,
          redirect_uri: this.config.redirectURI,
          code_verifier: codeVerifier,
        }
      : {
          client_id: this.config.clientId,
          code,
          redirect_uri: this.config.redirectURI,
          client_secret: this.config.clientSecret ?? "",
        };

    if (!codeVerifier && !this.config.clientSecret) {
      throw new Error(
        "clientSecret is required when codeVerifier is not provided.",
      );
    }

    return this.http
      .post("token", {
        json: {
          ...payload,
          grant_type: "authorization_code",
        },
      })
      .json<OAuthTokenResponse>();
  }

  /**
   * 使用 refresh_token 刷新访问令牌（grant_type=refresh_token）。
   */
  async refreshAccessToken({ refreshToken }: OAuthRefreshTokenOptions) {
    const payload: OAuthRefreshTokenRequest = {
      client_id: this.config.clientId,
      refresh_token: refreshToken,
      client_secret: this.config.clientSecret,
    };

    return this.http
      .post("token", {
        json: {
          ...payload,
          grant_type: "refresh_token",
        },
      })
      .json<OAuthTokenResponse>();
  }

  /**
   * 基于 access_token 创建授权态 API 客户端。
   */
  createAuthorizedClient(accessToken: string) {
    const authorization = `Bearer ${accessToken}`;

    const userHttp = ky.create({
      prefixUrl: new URL("user/", this.config.baseURL),
      headers: {
        Authorization: authorization,
      },
      ...LXNS_HTTP_OPTIONS,
    });

    const maimaiPersonalHttp = ky.create({
      prefixUrl: new URL("user/maimai/", this.config.baseURL),
      headers: {
        Authorization: authorization,
      },
      ...LXNS_HTTP_OPTIONS,
    });

    const chunithmPersonalHttp = ky.create({
      prefixUrl: new URL("user/chunithm/", this.config.baseURL),
      headers: {
        Authorization: authorization,
      },
      ...LXNS_HTTP_OPTIONS,
    });

    return new OAuthAuthorizedApi(
      userHttp,
      maimaiPersonalHttp,
      chunithmPersonalHttp,
    );
  }
}

export default LxnsOAuthClient;
