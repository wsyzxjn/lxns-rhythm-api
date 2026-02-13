import ky, { type HTTPError, type Options } from "ky";
import { ChunithmDevApi } from "../api/chunithm/dev.js";
import { ChunithmPersonalApi } from "../api/chunithm/personal.js";
import { ChunithmPublicApi } from "../api/chunithm/public.js";
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

async function wrapKyError(error: HTTPError): Promise<HTTPError> {
  const status = error.response.status;

  try {
    const payload = (await error.response
      .clone()
      .json()) as Partial<Types.ApiResponse>;
    if (typeof payload.success === "boolean") {
      throw new LxnsApiError(
        {
          success: payload.success,
          code: payload.code ?? status,
          message: payload.message ?? error.message,
          data: payload.data,
        },
        status,
      );
    }
  } catch {}

  throw new LxnsApiError(
    {
      success: false,
      code: status,
      message: error.message,
    },
    status,
  );
}

export type LxnsApiClientOptions = Types.LxnsApiClientOptions;

export class LxnsApiClient<O extends LxnsApiClientOptions> {
  public config: LxnsApiClientOptions & { baseURL: string };

  /**
   * maimai API
   */
  public readonly maimai: Types.MaimaiApiOf<O>;
  /**
   * chunithm API
   */
  public readonly chunithm: Types.ChunithmApiOf<O>;

  private static readonly BASE_OPTIONS: Options = {
    parseJson: parseLxnsJson,
    throwHttpErrors: true,
    hooks: {
      beforeError: [wrapKyError],
    },
  };

  private mountGameApi<
    TPublic,
    TDev,
    TPersonal,
    TExtra extends object = object,
  >({
    public: publicApi,
    dev,
    personal,
    extra,
  }: {
    public: TPublic;
    dev?: TDev;
    personal?: TPersonal;
    extra?: TExtra;
  }): Types.GameApi<O, TPublic, TDev, TPersonal, TExtra> {
    const namespace: Record<string, unknown> = {
      public: publicApi,
      ...(extra ?? {}),
    };

    if (dev) {
      namespace.dev = dev;
    }

    if (personal) {
      namespace.personal = personal;
    }

    return namespace as Types.GameApi<O, TPublic, TDev, TPersonal, TExtra>;
  }

  constructor(config?: Readonly<O>) {
    this.config = {
      ...config,
      baseURL: config?.baseURL ?? "https://maimai.lxns.net/api/v0/",
    };

    const { baseURL, devAccessToken, personalAccessToken } = this.config;

    // 创建各域的 HTTP 客户端
    const maimaiHttpPublic = ky.create({
      prefixUrl: new URL("maimai/", baseURL),
      ...LxnsApiClient.BASE_OPTIONS,
    });

    const maimaiHttpDev = devAccessToken
      ? ky.create({
          prefixUrl: new URL("maimai/", baseURL),
          headers: {
            Authorization: devAccessToken,
          },
          ...LxnsApiClient.BASE_OPTIONS,
        })
      : undefined;

    const maimaiHttpPersonal = personalAccessToken
      ? ky.create({
          prefixUrl: new URL("user/maimai/", baseURL),
          headers: {
            "X-User-Token": personalAccessToken,
          },
          ...LxnsApiClient.BASE_OPTIONS,
        })
      : undefined;

    this.maimai = this.mountGameApi<
      MaimaiPublicApi,
      MaimaiDevApi,
      MaimaiPersonalApi,
      Types.MaimaiApiExtra
    >({
      public: new MaimaiPublicApi(maimaiHttpPublic),
      dev: maimaiHttpDev ? new MaimaiDevApi(maimaiHttpDev) : undefined,
      personal: maimaiHttpPersonal
        ? new MaimaiPersonalApi(maimaiHttpPersonal)
        : undefined,
      extra: {
        getAsset: async (type, id) => {
          return new Uint8Array(
            await ky
              .get(
                `https://assets2.lxns.net/maimai/${type}/${id + (type === "music" ? ".mp3" : ".png")}`,
              )
              .arrayBuffer(),
          );
        },
      },
    });

    const chunithmHttpPublic = ky.create({
      prefixUrl: new URL("chunithm/", baseURL),
      ...LxnsApiClient.BASE_OPTIONS,
    });

    const chunithmHttpDev = devAccessToken
      ? ky.create({
          prefixUrl: new URL("chunithm/", baseURL),
          headers: {
            Authorization: devAccessToken,
          },
          ...LxnsApiClient.BASE_OPTIONS,
        })
      : undefined;

    const chunithmHttpPersonal = personalAccessToken
      ? ky.create({
          prefixUrl: new URL("user/chunithm/", baseURL),
          headers: {
            "X-User-Token": personalAccessToken,
          },
          ...LxnsApiClient.BASE_OPTIONS,
        })
      : undefined;

    this.chunithm = this.mountGameApi<
      ChunithmPublicApi,
      ChunithmDevApi,
      ChunithmPersonalApi,
      Types.ChunithmApiExtra
    >({
      public: new ChunithmPublicApi(chunithmHttpPublic),
      dev: chunithmHttpDev ? new ChunithmDevApi(chunithmHttpDev) : undefined,
      personal: chunithmHttpPersonal
        ? new ChunithmPersonalApi(chunithmHttpPersonal)
        : undefined,
      extra: {
        getAsset: async (type, id) => {
          return new Uint8Array(
            await ky
              .get(`https://assets2.lxns.net/chunithm/${type}/${id}.png`)
              .arrayBuffer(),
          );
        },
      },
    });
  }
}

export default LxnsApiClient;
