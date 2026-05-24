import assert from "node:assert/strict";
import test from "node:test";
import {
  isNotFoundError,
  LxnsApiClient,
  LxnsOAuthClient,
  type OAuthScope,
} from "lxns-rhythm-api";

const env = process.env;

const baseURL = env.LXNS_BASE_URL?.trim() || undefined;
const devAccessToken = env.LXNS_DEV_ACCESS_TOKEN;
const personalAccessToken = env.LXNS_PERSONAL_ACCESS_TOKEN;

const client = new LxnsApiClient<{
  baseURL?: string;
  devAccessToken: string;
  personalAccessToken: string;
}>({
  baseURL,
  devAccessToken: devAccessToken ?? "",
  personalAccessToken: personalAccessToken ?? "",
});

function required(name: string) {
  return env[name]?.trim() || undefined;
}

function numberEnv(name: string) {
  const value = required(name);
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  assert(Number.isFinite(parsed), `${name} must be a finite number.`);
  return parsed;
}

function jsonEnv<T>(name: string) {
  const value = required(name);
  if (!value) {
    return undefined;
  }

  return JSON.parse(value) as T;
}

async function expectValue<T>(promise: Promise<T>) {
  const value = await promise;
  assert.notEqual(value, undefined);
  assert.notEqual(value, null);
  return value;
}

test("LXNS API integration", async (t) => {
  const maimaiFriendCode = numberEnv("LXNS_MAIMAI_FRIEND_CODE");
  const maimaiQQ = numberEnv("LXNS_MAIMAI_QQ");
  const chunithmFriendCode = numberEnv("LXNS_CHUNITHM_FRIEND_CODE");
  const chunithmQQ = numberEnv("LXNS_CHUNITHM_QQ");

  let maimaiSongId = numberEnv("LXNS_MAIMAI_SONG_ID");
  let chunithmSongId = numberEnv("LXNS_CHUNITHM_SONG_ID");

  await t.test("maimai.public.getSongList", async () => {
    const songList = await expectValue(
      client.maimai.public.getSongList(undefined, true),
    );
    assert(Array.isArray(songList.songs));
    maimaiSongId ??= songList.songs[0]?.id;
    assert(maimaiSongId, "maimai song list is empty.");
  });

  await t.test("maimai.public.getSong", async () => {
    assert(maimaiSongId, "maimai song id is not initialized.");
    await expectValue(client.maimai.public.getSong(maimaiSongId));
  });

  await t.test("maimai.public.getAliasList", async () => {
    await expectValue(client.maimai.public.getAliasList());
  });

  for (const collectionType of ["trophy", "icon", "plate", "frame"] as const) {
    let collectionId = numberEnv(
      `LXNS_MAIMAI_${collectionType.toUpperCase()}_ID`,
    );

    await t.test(
      `maimai.public.getCollectionList.${collectionType}`,
      async () => {
        const collectionList = await expectValue(
          client.maimai.public.getCollectionList(collectionType),
        );
        assert(Array.isArray(collectionList));
        collectionId ??= collectionList[0]?.id;
      },
    );

    await t.test(
      `maimai.public.getCollectionInfo.${collectionType}`,
      {
        skip: collectionId
          ? false
          : `${collectionType} list is empty; set LXNS_MAIMAI_${collectionType.toUpperCase()}_ID`,
      },
      async () => {
        assert(collectionId);
        await expectValue(
          client.maimai.public.getCollectionInfo(collectionType, collectionId),
        );
      },
    );
  }

  let maimaiCollectionGenreId = numberEnv("LXNS_MAIMAI_COLLECTION_GENRE_ID");

  await t.test("maimai.public.getCollectionGenreList", async () => {
    const collectionGenres = await expectValue(
      client.maimai.public.getCollectionGenreList(),
    );
    assert(Array.isArray(collectionGenres.collectionGenres));
    maimaiCollectionGenreId ??= collectionGenres.collectionGenres[0]?.id;
  });

  await t.test(
    "maimai.public.getCollectionGenreInfo",
    {
      skip: maimaiCollectionGenreId
        ? false
        : "collection genre list is empty; set LXNS_MAIMAI_COLLECTION_GENRE_ID",
    },
    async () => {
      assert(maimaiCollectionGenreId);
      await expectValue(
        client.maimai.public.getCollectionGenreInfo(maimaiCollectionGenreId),
      );
    },
  );

  await t.test("maimai.getAsset", async () => {
    assert(maimaiSongId, "maimai song id is not initialized.");
    await expectValue(client.maimai.getAsset("jacket", maimaiSongId));
  });

  await t.test("chunithm.public.getSongList", async () => {
    const songList = await expectValue(
      client.chunithm.public.getSongList(undefined, true),
    );
    assert(Array.isArray(songList.songs));
    chunithmSongId ??= songList.songs[0]?.id;
    assert(chunithmSongId, "chunithm song list is empty.");
  });

  await t.test("chunithm.public.getSong", async () => {
    assert(chunithmSongId, "chunithm song id is not initialized.");
    await expectValue(client.chunithm.public.getSong(chunithmSongId));
  });

  await t.test("chunithm.public.getAliasList", async () => {
    await expectValue(client.chunithm.public.getAliasList());
  });

  for (const collectionType of [
    "trophy",
    "character",
    "plate",
    "icon",
  ] as const) {
    let collectionId = numberEnv(
      `LXNS_CHUNITHM_${collectionType.toUpperCase()}_ID`,
    );

    await t.test(
      `chunithm.public.getCollectionList.${collectionType}`,
      async () => {
        const collectionList = await expectValue(
          client.chunithm.public.getCollectionList(collectionType),
        );
        assert(Array.isArray(collectionList));
        collectionId ??= collectionList[0]?.id;
      },
    );

    await t.test(
      `chunithm.public.getCollectionInfo.${collectionType}`,
      {
        skip: collectionId
          ? false
          : `${collectionType} list is empty; set LXNS_CHUNITHM_${collectionType.toUpperCase()}_ID`,
      },
      async () => {
        assert(collectionId);
        await expectValue(
          client.chunithm.public.getCollectionInfo(
            collectionType,
            collectionId,
          ),
        );
      },
    );
  }

  await t.test("chunithm.getAsset", async () => {
    assert(chunithmSongId, "chunithm song id is not initialized.");
    await expectValue(client.chunithm.getAsset("jacket", chunithmSongId));
  });

  await t.test(
    "maimai.personal.getPlayer",
    { skip: personalAccessToken ? false : "set LXNS_PERSONAL_ACCESS_TOKEN" },
    async () => {
      await expectValue(client.maimai.personal.getPlayer());
    },
  );

  await t.test(
    "maimai.personal.getScores",
    { skip: personalAccessToken ? false : "set LXNS_PERSONAL_ACCESS_TOKEN" },
    async () => {
      await expectValue(client.maimai.personal.getScores());
    },
  );

  const maimaiPersonalPostScores = jsonEnv<
    Parameters<typeof client.maimai.personal.postScores>[0]
  >("LXNS_MAIMAI_PERSONAL_POST_SCORES_JSON");

  await t.test(
    "maimai.personal.postScores",
    {
      skip: maimaiPersonalPostScores
        ? false
        : "set LXNS_MAIMAI_PERSONAL_POST_SCORES_JSON to run this write API",
    },
    async () => {
      assert(maimaiPersonalPostScores);
      await expectValue(
        client.maimai.personal.postScores(maimaiPersonalPostScores),
      );
    },
  );

  await t.test(
    "chunithm.personal.getPlayer",
    { skip: personalAccessToken ? false : "set LXNS_PERSONAL_ACCESS_TOKEN" },
    async (t) => {
      try {
        await expectValue(client.chunithm.personal.getPlayer());
      } catch (error) {
        if (isNotFoundError(error)) {
          t.skip("current account has no chunithm personal data");
          return;
        }

        throw error;
      }
    },
  );

  await t.test(
    "chunithm.personal.getScores",
    { skip: personalAccessToken ? false : "set LXNS_PERSONAL_ACCESS_TOKEN" },
    async (t) => {
      try {
        await expectValue(client.chunithm.personal.getScores());
      } catch (error) {
        if (isNotFoundError(error)) {
          t.skip("current account has no chunithm personal data");
          return;
        }

        throw error;
      }
    },
  );

  const chunithmPersonalPostScores = jsonEnv<
    Parameters<typeof client.chunithm.personal.postScores>[0]
  >("LXNS_CHUNITHM_PERSONAL_POST_SCORES_JSON");

  await t.test(
    "chunithm.personal.postScores",
    {
      skip: chunithmPersonalPostScores
        ? false
        : "set LXNS_CHUNITHM_PERSONAL_POST_SCORES_JSON to run this write API",
    },
    async () => {
      assert(chunithmPersonalPostScores);
      await expectValue(
        client.chunithm.personal.postScores(chunithmPersonalPostScores),
      );
    },
  );

  await t.test(
    "maimai.dev.getPlayer",
    {
      skip:
        devAccessToken && maimaiFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      await expectValue(client.maimai.dev.getPlayer(maimaiFriendCode));
    },
  );

  await t.test(
    "maimai.dev.getPlayerByQQ",
    {
      skip:
        devAccessToken && maimaiQQ
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_QQ",
    },
    async () => {
      assert(maimaiQQ);
      await expectValue(client.maimai.dev.getPlayerByQQ(maimaiQQ));
    },
  );

  await t.test(
    "maimai.dev.getBests",
    {
      skip:
        devAccessToken && maimaiFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      await expectValue(client.maimai.dev.getBests(maimaiFriendCode));
    },
  );

  await t.test(
    "maimai.dev.getApBests",
    {
      skip:
        devAccessToken && maimaiFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      await expectValue(client.maimai.dev.getApBests(maimaiFriendCode));
    },
  );

  await t.test(
    "maimai.dev.getRecents",
    {
      skip:
        devAccessToken && maimaiFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      await expectValue(client.maimai.dev.getRecents(maimaiFriendCode));
    },
  );

  await t.test(
    "maimai.dev.getAllBestScores",
    {
      skip:
        devAccessToken && maimaiFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      await expectValue(client.maimai.dev.getAllBestScores(maimaiFriendCode));
    },
  );

  await t.test(
    "maimai.dev.getHeatmap",
    {
      skip:
        devAccessToken && maimaiFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      await expectValue(client.maimai.dev.getHeatmap(maimaiFriendCode));
    },
  );

  await t.test(
    "maimai.dev.getTrend",
    {
      skip:
        devAccessToken && maimaiFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      await expectValue(client.maimai.dev.getTrend(maimaiFriendCode));
    },
  );

  await t.test(
    "maimai.dev.getScoreHistory",
    {
      skip:
        devAccessToken && maimaiFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      await expectValue(client.maimai.dev.getScoreHistory(maimaiFriendCode));
    },
  );

  const maimaiCollectionProgressId = numberEnv(
    "LXNS_MAIMAI_COLLECTION_PROGRESS_ID",
  );

  await t.test(
    "maimai.dev.getCollectionProgress",
    {
      skip:
        devAccessToken && maimaiFriendCode && maimaiCollectionProgressId
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN, LXNS_MAIMAI_FRIEND_CODE and LXNS_MAIMAI_COLLECTION_PROGRESS_ID",
    },
    async () => {
      assert(maimaiFriendCode);
      assert(maimaiCollectionProgressId);
      await expectValue(
        client.maimai.dev.getCollectionProgress(
          maimaiFriendCode,
          (required("LXNS_MAIMAI_COLLECTION_PROGRESS_TYPE") as
            | "trophy"
            | "icon"
            | "plate"
            | "frame") ?? "trophy",
          maimaiCollectionProgressId,
        ),
      );
    },
  );

  const maimaiDevPostPlayer = jsonEnv<
    Parameters<typeof client.maimai.dev.postPlayer>[0]
  >("LXNS_MAIMAI_DEV_POST_PLAYER_JSON");

  await t.test(
    "maimai.dev.postPlayer",
    {
      skip: maimaiDevPostPlayer
        ? false
        : "set LXNS_MAIMAI_DEV_POST_PLAYER_JSON to run this write API",
    },
    async () => {
      assert(maimaiDevPostPlayer);
      await expectValue(client.maimai.dev.postPlayer(maimaiDevPostPlayer));
    },
  );

  const maimaiDevPostScores = jsonEnv<
    Parameters<typeof client.maimai.dev.postScores>[1]
  >("LXNS_MAIMAI_DEV_POST_SCORES_JSON");

  await t.test(
    "maimai.dev.postScores",
    {
      skip:
        maimaiDevPostScores && maimaiFriendCode
          ? false
          : "set LXNS_MAIMAI_DEV_POST_SCORES_JSON and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      assert(maimaiDevPostScores);
      await expectValue(
        client.maimai.dev.postScores(maimaiFriendCode, maimaiDevPostScores),
      );
    },
  );

  const maimaiDevPostHtml = required("LXNS_MAIMAI_DEV_POST_HTML");

  await t.test(
    "maimai.dev.postHtml",
    {
      skip:
        maimaiDevPostHtml && maimaiFriendCode
          ? false
          : "set LXNS_MAIMAI_DEV_POST_HTML and LXNS_MAIMAI_FRIEND_CODE",
    },
    async () => {
      assert(maimaiFriendCode);
      assert(maimaiDevPostHtml);
      await expectValue(
        client.maimai.dev.postHtml(maimaiFriendCode, maimaiDevPostHtml),
      );
    },
  );

  await t.test(
    "chunithm.dev.getPlayer",
    {
      skip:
        devAccessToken && chunithmFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      await expectValue(client.chunithm.dev.getPlayer(chunithmFriendCode));
    },
  );

  await t.test(
    "chunithm.dev.getPlayerByQQ",
    {
      skip:
        devAccessToken && chunithmQQ
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_QQ",
    },
    async () => {
      assert(chunithmQQ);
      await expectValue(client.chunithm.dev.getPlayerByQQ(chunithmQQ));
    },
  );

  await t.test(
    "chunithm.dev.getBests",
    {
      skip:
        devAccessToken && chunithmFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      await expectValue(client.chunithm.dev.getBests(chunithmFriendCode));
    },
  );

  await t.test(
    "chunithm.dev.getBest",
    {
      skip:
        devAccessToken && chunithmFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      await expectValue(
        client.chunithm.dev.getBest(chunithmFriendCode, {
          songId: chunithmSongId,
        }),
      );
    },
  );

  await t.test(
    "chunithm.dev.getAllBestScores",
    {
      skip:
        devAccessToken && chunithmFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      await expectValue(
        client.chunithm.dev.getAllBestScores(chunithmFriendCode),
      );
    },
  );

  await t.test(
    "chunithm.dev.getRecents",
    {
      skip:
        devAccessToken && chunithmFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      await expectValue(client.chunithm.dev.getRecents(chunithmFriendCode));
    },
  );

  await t.test(
    "chunithm.dev.getScoreHistory",
    {
      skip:
        devAccessToken && chunithmFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      await expectValue(
        client.chunithm.dev.getScoreHistory(chunithmFriendCode),
      );
    },
  );

  await t.test(
    "chunithm.dev.getHeatmap",
    {
      skip:
        devAccessToken && chunithmFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      await expectValue(client.chunithm.dev.getHeatmap(chunithmFriendCode));
    },
  );

  await t.test(
    "chunithm.dev.getTrend",
    {
      skip:
        devAccessToken && chunithmFriendCode
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      await expectValue(client.chunithm.dev.getTrend(chunithmFriendCode));
    },
  );

  const chunithmCollectionProgressId = numberEnv(
    "LXNS_CHUNITHM_COLLECTION_PROGRESS_ID",
  );

  await t.test(
    "chunithm.dev.getCollectionProgress",
    {
      skip:
        devAccessToken && chunithmFriendCode && chunithmCollectionProgressId
          ? false
          : "set LXNS_DEV_ACCESS_TOKEN, LXNS_CHUNITHM_FRIEND_CODE and LXNS_CHUNITHM_COLLECTION_PROGRESS_ID",
    },
    async () => {
      assert(chunithmFriendCode);
      assert(chunithmCollectionProgressId);
      await expectValue(
        client.chunithm.dev.getCollectionProgress(
          chunithmFriendCode,
          (required("LXNS_CHUNITHM_COLLECTION_PROGRESS_TYPE") as
            | "trophy"
            | "character"
            | "plate"
            | "icon") ?? "trophy",
          chunithmCollectionProgressId,
        ),
      );
    },
  );

  const chunithmDevPostPlayer = jsonEnv<
    Parameters<typeof client.chunithm.dev.postPlayer>[0]
  >("LXNS_CHUNITHM_DEV_POST_PLAYER_JSON");

  await t.test(
    "chunithm.dev.postPlayer",
    {
      skip: chunithmDevPostPlayer
        ? false
        : "set LXNS_CHUNITHM_DEV_POST_PLAYER_JSON to run this write API",
    },
    async () => {
      assert(chunithmDevPostPlayer);
      await expectValue(client.chunithm.dev.postPlayer(chunithmDevPostPlayer));
    },
  );

  const chunithmDevPostScores = jsonEnv<
    Parameters<typeof client.chunithm.dev.postScores>[1]
  >("LXNS_CHUNITHM_DEV_POST_SCORES_JSON");

  await t.test(
    "chunithm.dev.postScores",
    {
      skip:
        chunithmDevPostScores && chunithmFriendCode
          ? false
          : "set LXNS_CHUNITHM_DEV_POST_SCORES_JSON and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      assert(chunithmDevPostScores);
      await expectValue(
        client.chunithm.dev.postScores(
          chunithmFriendCode,
          chunithmDevPostScores,
        ),
      );
    },
  );

  const chunithmDevPostHtml = required("LXNS_CHUNITHM_DEV_POST_HTML");

  await t.test(
    "chunithm.dev.postHtml",
    {
      skip:
        chunithmDevPostHtml && chunithmFriendCode
          ? false
          : "set LXNS_CHUNITHM_DEV_POST_HTML and LXNS_CHUNITHM_FRIEND_CODE",
    },
    async () => {
      assert(chunithmFriendCode);
      assert(chunithmDevPostHtml);
      await expectValue(
        client.chunithm.dev.postHtml(chunithmFriendCode, chunithmDevPostHtml),
      );
    },
  );

  const oauthClient = new LxnsOAuthClient({
    baseURL,
    clientId: required("LXNS_OAUTH_CLIENT_ID") ?? "test-client",
    clientSecret: required("LXNS_OAUTH_CLIENT_SECRET"),
    redirectURI:
      required("LXNS_OAUTH_REDIRECT_URI") ?? "http://localhost/callback",
  });

  await t.test("oauth.createAuthorizeURL", async () => {
    const authorizeURL = oauthClient.createAuthorizeURL({
      scope: (required("LXNS_OAUTH_SCOPE") as OAuthScope | undefined) ?? [
        "read_user_profile",
        "read_player",
      ],
      state: "lxns-rhythm-api-test",
    });
    assert.match(authorizeURL, /^https?:\/\//);
  });

  await t.test(
    "oauth.exchangeCodeForToken",
    {
      skip:
        required("LXNS_OAUTH_CODE") &&
        (required("LXNS_OAUTH_CLIENT_SECRET") ||
          required("LXNS_OAUTH_CODE_VERIFIER"))
          ? false
          : "set LXNS_OAUTH_CODE and either LXNS_OAUTH_CLIENT_SECRET or LXNS_OAUTH_CODE_VERIFIER",
    },
    async () => {
      const code = required("LXNS_OAUTH_CODE");
      assert(code);
      await expectValue(
        oauthClient.exchangeCodeForToken({
          code,
          codeVerifier: required("LXNS_OAUTH_CODE_VERIFIER"),
        }),
      );
    },
  );

  await t.test(
    "oauth.refreshAccessToken",
    {
      skip: required("LXNS_OAUTH_REFRESH_TOKEN")
        ? false
        : "set LXNS_OAUTH_REFRESH_TOKEN",
    },
    async () => {
      const refreshToken = required("LXNS_OAUTH_REFRESH_TOKEN");
      assert(refreshToken);
      await expectValue(oauthClient.refreshAccessToken({ refreshToken }));
    },
  );

  const oauthAccessToken = required("LXNS_OAUTH_ACCESS_TOKEN");
  const authorizedClient = oauthAccessToken
    ? oauthClient.createAuthorizedClient(oauthAccessToken)
    : undefined;

  await t.test(
    "oauth.user.getProfile",
    { skip: authorizedClient ? false : "set LXNS_OAUTH_ACCESS_TOKEN" },
    async () => {
      assert(authorizedClient);
      await expectValue(authorizedClient.user.getProfile());
    },
  );

  await t.test(
    "oauth.user.getToken",
    { skip: authorizedClient ? false : "set LXNS_OAUTH_ACCESS_TOKEN" },
    async () => {
      assert(authorizedClient);
      await expectValue(authorizedClient.user.getToken());
    },
  );

  await t.test(
    "oauth.maimai.personal.getPlayer",
    { skip: authorizedClient ? false : "set LXNS_OAUTH_ACCESS_TOKEN" },
    async () => {
      assert(authorizedClient);
      await expectValue(authorizedClient.maimai.getPlayer());
    },
  );

  await t.test(
    "oauth.maimai.personal.getScores",
    { skip: authorizedClient ? false : "set LXNS_OAUTH_ACCESS_TOKEN" },
    async () => {
      assert(authorizedClient);
      await expectValue(authorizedClient.maimai.getScores());
    },
  );

  await t.test(
    "oauth.chunithm.personal.getPlayer",
    { skip: authorizedClient ? false : "set LXNS_OAUTH_ACCESS_TOKEN" },
    async () => {
      assert(authorizedClient);
      await expectValue(authorizedClient.chunithm.getPlayer());
    },
  );

  await t.test(
    "oauth.chunithm.personal.getScores",
    { skip: authorizedClient ? false : "set LXNS_OAUTH_ACCESS_TOKEN" },
    async () => {
      assert(authorizedClient);
      await expectValue(authorizedClient.chunithm.getScores());
    },
  );
});
