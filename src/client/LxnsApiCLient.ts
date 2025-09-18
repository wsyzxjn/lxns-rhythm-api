import ky from "ky";
import { MaimaiPublicApi } from "../apis/maimai/public.js";
import { MaimaiDevApi } from "../apis/maimai/dev.js";
import { MaimaiPersonalApi } from "../apis/maimai/personal.js";
import type * as Types from "./types.js";

export interface LxnsApiClientOptions {
  personalAccessToken?: string;
  devAccessToken?: string;
  baseURL?: string;
}

export class LxnsApiClient<O extends LxnsApiClientOptions> {
  public config: LxnsApiClientOptions & { baseURL: string } = {
    baseURL: "https://maimai.lxns.net/api/v0/",
  };

  /**
   * maimai API
   */
  public readonly maimai: Types.MaiMaiOf<O>;

  constructor(config?: Readonly<O>) {
    this.config = {
      baseURL: config?.baseURL ?? this.config.baseURL,
      personalAccessToken: config?.personalAccessToken,
      devAccessToken: config?.devAccessToken,
    };

    const { baseURL, devAccessToken, personalAccessToken } = this.config;

    // 创建各域的 HTTP 客户端
    const httpPublic = ky.create({
      prefixUrl: new URL("maimai/", baseURL),
    });

    const httpDev = devAccessToken
      ? ky.create({
          prefixUrl: new URL("maimai/", baseURL),
          headers: {
            Authorization: devAccessToken,
          },
        })
      : undefined;

    const httpPersonal = personalAccessToken
      ? ky.create({
          prefixUrl: new URL("user/maimai/", baseURL),
          headers: {
            "X-User-Token": personalAccessToken,
          },
        })
      : undefined;

    // 依据是否提供 token 挂载可用的子 API
    const maimai: {
      public: MaimaiPublicApi;
      dev?: MaimaiDevApi;
      personal?: MaimaiPersonalApi;
    } = {
      public: new MaimaiPublicApi(httpPublic),
    };

    if (httpDev) {
      maimai.dev = new MaimaiDevApi(httpDev);
    }

    if (httpPersonal) {
      maimai.personal = new MaimaiPersonalApi(httpPersonal);
    }

    this.maimai = maimai as Types.MaiMaiOf<O>;
  }
}

export default LxnsApiClient;
