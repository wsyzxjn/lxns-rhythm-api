# lxns-rhythm-api

一个面向 [落雪咖啡屋查分器](https://maimai.lxns.net/) 的 TypeScript SDK，当前支持 `maimai` 与 `chunithm`。

## 特性

- 基于 `ky` 的轻量 HTTP 客户端。
- 统一的 `public / dev / personal` 命名空间。
- 完善的类型支持，根据是否传入 token 自动推断可用 API 类型。
- 统一错误类型：`LxnsApiError`。

## 安装

```bash
# npm
npm i lxns-rhythm-api

# pnpm
pnpm add lxns-rhythm-api

# yarn
yarn add lxns-rhythm-api
```

## 快速开始

```ts
import { LxnsApiClient } from "lxns-rhythm-api";

const client = new LxnsApiClient({
  devAccessToken: "<your-dev-token>",
  personalAccessToken: "<your-personal-token>",
});

// maimai public
const maimaiSong = await client.maimai.public.getSong(114);

// maimai dev
const maimaiPlayer = await client.maimai.dev.getPlayerByQQ(1234567890);

// chunithm public
const chunithmSong = await client.chunithm.public.getSong(1);

// chunithm personal
const me = await client.chunithm.personal.getPlayer();
```

## 配置

```ts
new LxnsApiClient({
  personalAccessToken?: string;
  devAccessToken?: string;
  baseURL?: string; // 默认: https://maimai.lxns.net/api/v0/
});
```

- `devAccessToken`：启用 `*.dev` 命名空间。
- `personalAccessToken`：启用 `*.personal` 命名空间。
- `baseURL`：默认 `https://maimai.lxns.net/api/v0/`。

## 资源接口

两个游戏命名空间都提供：

- `getAsset(type, id): Promise<Uint8Array>`

示例：

```ts
const jacket = await client.maimai.getAsset("jacket", 114);
const icon = await client.chunithm.getAsset("icon", 1);
```

## OAuth 流程

```ts
import { LxnsOAuthClient } from "lxns-rhythm-api";

const client = new LxnsOAuthClient({
  clientId: "<your-client-id>",
  redirectURI: "https://example.com/callback",
  clientSecret: "<your-client-secret>", // PKCE 可不传
});

// 1) 生成授权链接，跳转给用户
const authorizeURL = client.createAuthorizeURL({
  scope: ["read_user_profile", "read_player"],
  state: "nonce", // 可选
  codeChallenge: "<code-challenge>", // PKCE 可选
  codeChallengeMethod: "S256",
});

// 2) 回调拿到 code 后换 token
const token = await client.exchangeCodeForToken({
  code: "<auth-code>",
  codeVerifier: "<code-verifier>", // PKCE 模式传这个
});

// 3) 用 access_token 创建授权态客户端
const authorized = client.createAuthorizedClient(token.access_token);

// 4) 调用 OAuth 用户接口和 personal 接口
const profile = await authorized.user.getProfile();
const maimaiPlayer = await authorized.maimai.getPlayer();
const chunithmPlayer = await authorized.chunithm.getPlayer();

// 5) 刷新 token
const nextToken = await client.refreshAccessToken({
  refreshToken: token.refresh_token,
});
```

## 错误处理

SDK 会将 API 错误统一抛为 `LxnsApiError`。

```ts
import {
  LxnsApiError,
  isAuthError,
  isNotFoundError,
  isRateLimitError,
  isServerError,
} from "lxns-rhythm-api";

try {
  await client.maimai.dev.getPlayer(1234567890);
} catch (error) {
  if (error instanceof LxnsApiError) {
    console.error(error.code, error.status, error.message);
  }

  if (isNotFoundError(error)) {
    // 404
  }
  if (isAuthError(error)) {
    // 401 / 403
  }
  if (isRateLimitError(error)) {
    // 429
  }
  if (isServerError(error)) {
    // >= 500
  }
}
```

## 导出

```ts
import {
  LxnsApiClient,
  LxnsOAuthClient,
  LxnsApiError,
  isLxnsApiError,
  MaimaiModels,
  ChunithmModels,
} from "lxns-rhythm-api";
```

## 相关文档

- [Lxns maimai API](https://maimai.lxns.net/docs/api/maimai)
- [Lxns chunithm API](https://maimai.lxns.net/docs/api/chunithm)
- [Lxns OAuth API](https://maimai.lxns.net/docs/api/oauth)
- [Lxns OAuth 接入指南](https://maimai.lxns.net/docs/oauth-guide)

## 构建与测试

```bash
pnpm run build
pnpm run test
```

## License

MIT
