import ky, { type Options } from "ky";
import { MaimaiDevApi } from "../api/maimai/dev.js";
import { MaimaiPersonalApi } from "../api/maimai/personal.js";
import { MaimaiPublicApi } from "../api/maimai/public.js";
import { LxnsApiError } from "../lxns-api-error.js";
import type * as Types from "./client-types.js";

function parseLxnsJson(text: string) {
  const payload = JSON.parse(text) as Types.ApiResponse;

  if (payload.success === false) {
    throw new LxnsApiError(payload);
  }

  if (payload.success === true) {
    return payload.data;
  }

  return payload;
}

export type LxnsApiClientOptions = Types.LxnsApiClientOptions;

export class LxnsApiClient<O extends LxnsApiClientOptions> {
  public config: LxnsApiClientOptions & { baseURL: string };

  /**
   * maimai API
   */
  public readonly maimai: Types.MaiMaiOf<O>;

  private static readonly BASE_OPTIONS: Options = {
    parseJson: parseLxnsJson,
    throwHttpErrors: false,
  };

  constructor(config?: Readonly<O>) {
    this.config = {
      ...config,
      baseURL: config?.baseURL ?? "https://maimai.lxns.net/api/v0/",
    };

    const { baseURL, devAccessToken, personalAccessToken } = this.config;

    // 创建各域的 HTTP 客户端
    const httpPublic = ky.create({
      prefixUrl: new URL("maimai/", baseURL),
      ...LxnsApiClient.BASE_OPTIONS,
    });

    const httpDev = devAccessToken
      ? ky.create({
          prefixUrl: new URL("maimai/", baseURL),
          headers: {
            Authorization: devAccessToken,
          },
          ...LxnsApiClient.BASE_OPTIONS,
        })
      : undefined;

    const httpPersonal = personalAccessToken
      ? ky.create({
          prefixUrl: new URL("user/maimai/", baseURL),
          headers: {
            "X-User-Token": personalAccessToken,
          },
          ...LxnsApiClient.BASE_OPTIONS,
        })
      : undefined;

    // 依据是否提供 token 挂载可用的子 API
    const maimai: Types.MaiMai = {
      public: new MaimaiPublicApi(httpPublic),
      getAsset: async (type, id) => {
        return new Uint8Array(
          await ky
            .get(
              `https://assets2.lxns.net/maimai/${type}/${id + (type === "music" ? ".mp3" : ".png")}`,
            )
            .arrayBuffer(),
        );
      },
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
