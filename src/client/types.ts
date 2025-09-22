import type { MaimaiPublicApi } from "../apis/maimai/public.js";
import type { MaimaiDevApi } from "../apis/maimai/dev.js";
import type { MaimaiPersonalApi } from "../apis/maimai/personal.js";
import type { LxnsApiClientOptions } from "./LxnsApiCLient.js";
import type { AssetType } from "../apis/maimai/models.js";

// Options 中仅与 token 相关的子集
export type LxnsApiClientTokens = Omit<LxnsApiClientOptions, "baseURL">;

// 动态开关标志：根据是否提供 token 决定可用的子域（只读视图）
export type Flags = Readonly<LxnsApiClientTokens>;

// 展平交叉类型，获得更友好的 IDE 悬浮与打印
export type Simplify<T> = { [K in keyof T]: T[K] } & {};

// 如果类型 T 中不包含 null/undefined（即被明确为已定义），则返回 Then，否则返回 Else（默认 {}）
export type IfDefined<T, Then, Else = {}> = [T] extends [NonNullable<T>]
  ? Then
  : Else;

export type MaiMai = {
  public: MaimaiPublicApi;
  dev?: MaimaiDevApi;
  personal?: MaimaiPersonalApi;
  getAsset: (type: AssetType, id: number) => Promise<Buffer>;
};

// 条件类型工厂：根据 Flags 自动计算 maimai 的形态
export type MaiMaiOf<O extends Flags> = Simplify<
  Omit<MaiMai, "dev" | "personal"> &
    IfDefined<O["devAccessToken"], { dev: MaimaiDevApi }> &
    IfDefined<O["personalAccessToken"], { personal: MaimaiPersonalApi }>
>;
