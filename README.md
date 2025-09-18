# lxns-sdk

一个用于访问 Lxns API 的轻量 TypeScript SDK。

- 零运行时依赖（仅使用 `ky` 发起请求）。
- 类型安全：根据传入的 token 自动在 `maimai` 命名空间上暴露 `public` / `dev` / `personal` 子 API。
- 现代构建

## 安装

```bash
# npm
npm i lxns-sdk

# pnpm
pnpm add lxns-sdk

# yarn
yarn add lxns-sdk
```

## 快速开始

```ts
import { LxnsApiClient } from "lxns-sdk";

// 无 token：仅可用 public API
const client = new LxnsApiClient();
const song = await client.maimai.public.getSong(114);
console.log(song.standard?.master);

// 开发者 API：传入 devAccessToken 后可用 maimai.dev
const devClient = new LxnsApiClient({
  devAccessToken: "<your-dev-token>",
});
const player = await devClient.maimai.dev.getPlayerByQQ(1507524536);
console.log(player);

// 个人 API：传入 personalAccessToken 后可用 maimai.personal
const personalClient = new LxnsApiClient({
  personalAccessToken: "<your-personal-token>",
});
const me = await personalClient.maimai.personal.getPlayer();
console.log(me);
```

## 配置项

构造函数签名：

```ts
new LxnsApiClient(options?: {
  personalAccessToken?: string;
  devAccessToken?: string;
  baseURL?: string; // 默认：https://maimai.lxns.net/api/v0/
});
```

- 当提供 `devAccessToken` 时：
  - SDK 会在 `maimai.dev` 命名空间下启用开发者接口。
  - 认证头：`Authorization: <devAccessToken>`。
  - 基础路径：`<baseURL>/maimai/`。
- 当提供 `personalAccessToken` 时：
  - SDK 会在 `maimai.personal` 命名空间下启用个人接口。
  - 认证头：`X-User-Token: <personalAccessToken>`。
  - 基础路径：`<baseURL>/user/maimai/`。
- `public` 始终可用：
  - 基础路径：`<baseURL>/maimai/`。

> 注意：`baseURL` 默认值为 `https://maimai.lxns.net/api/v0/`。

## API 概览

- `maimai.public`
  - `getSongList(version?: number, notes?: boolean)`
  - `getSong(id: number)`
  - `getAliasList()`
  - `getCollectionList(type, options)` 等
- `maimai.dev`（需 `devAccessToken`）
  - `getPlayer(friendCode)`、`getPlayerByQQ(qq)`、`getBests(...)` 等
- `maimai.personal`（需 `personalAccessToken`）
  - `getPlayer()`、`getScores()`、`postScores(scores)` 等

详细定义请参见源码：

- `src/apis/maimai/public.ts`
- `src/apis/maimai/dev.ts`
- `src/apis/maimai/personal.ts`

## 构建与测试

```bash
pnpm run build
pnpm run test
```

## 许可

MIT
