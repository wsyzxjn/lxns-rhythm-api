import type { ChunithmDevApi } from "../api/chunithm/dev-api.js";
import type { AssetType as ChunithmAssetType } from "../api/chunithm/models.js";
import type { ChunithmPersonalApi } from "../api/chunithm/personal-api.js";
import type { ChunithmPublicApi } from "../api/chunithm/public-api.js";
import type { MaimaiDevApi } from "../api/maimai/dev-api.js";
import type { AssetType } from "../api/maimai/models.js";
import type { MaimaiPersonalApi } from "../api/maimai/personal-api.js";
import type { MaimaiPublicApi } from "../api/maimai/public-api.js";

export type DataValue = Record<string, unknown> | Array<unknown> | null;

export type ApiResponse<TData = DataValue> = {
  success: boolean;
  code: number;
  message?: string;
  data?: TData;
};

export interface LxnsApiClientOptions {
  personalAccessToken?: string;
  devAccessToken?: string;
  baseURL?: string;
}

export type LxnsApiClientTokenFlags = Readonly<
  Omit<LxnsApiClientOptions, "baseURL">
>;

type IfDefined<T, Then, Else = object> = [T] extends [NonNullable<T>]
  ? Then
  : Else;

export type Simplify<T> = { [K in keyof T]: T[K] };

export type GameApi<
  O extends LxnsApiClientTokenFlags,
  TPublic,
  TDev,
  TPersonal,
  TExtra extends object = object,
> = Simplify<
  {
    public: TPublic;
  } & TExtra &
    IfDefined<O["devAccessToken"], { dev: TDev }> &
    IfDefined<O["personalAccessToken"], { personal: TPersonal }>
>;

export type MaimaiApiExtra = {
  getAsset: (type: AssetType, id: number) => Promise<Uint8Array>;
};

export type MaimaiApiOf<O extends LxnsApiClientTokenFlags> = GameApi<
  O,
  MaimaiPublicApi,
  MaimaiDevApi,
  MaimaiPersonalApi,
  MaimaiApiExtra
>;

export type ChunithmApiExtra = {
  getAsset: (type: ChunithmAssetType, id: number) => Promise<Uint8Array>;
};

export type ChunithmApiOf<O extends LxnsApiClientTokenFlags> = GameApi<
  O,
  ChunithmPublicApi,
  ChunithmDevApi,
  ChunithmPersonalApi,
  ChunithmApiExtra
>;
