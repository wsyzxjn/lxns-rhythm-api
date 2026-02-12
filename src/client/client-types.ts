import type { MaimaiDevApi } from "../api/maimai/dev.js";
import type { AssetType } from "../api/maimai/models.js";
import type { MaimaiPersonalApi } from "../api/maimai/personal.js";
import type { MaimaiPublicApi } from "../api/maimai/public.js";

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

type LxnsApiClientTokens = Omit<LxnsApiClientOptions, "baseURL">;
type Flags = Readonly<LxnsApiClientTokens>;
type Simplify<T> = { [K in keyof T]: T[K] } & {};
type IfDefined<T, Then, Else = object> = [T] extends [NonNullable<T>]
  ? Then
  : Else;

export type MaiMai = {
  public: MaimaiPublicApi;
  dev?: MaimaiDevApi;
  personal?: MaimaiPersonalApi;
  getAsset: (type: AssetType, id: number) => Promise<Uint8Array>;
};

export type MaiMaiOf<O extends Flags> = Simplify<
  Omit<MaiMai, "dev" | "personal"> &
    IfDefined<O["devAccessToken"], { dev: MaimaiDevApi }> &
    IfDefined<O["personalAccessToken"], { personal: MaimaiPersonalApi }>
>;
