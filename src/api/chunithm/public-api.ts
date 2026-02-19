import type { KyInstance } from "ky";
import type * as Public from "./types/public-types.js";

/**
 * chunithm 公共 API
 */
export class ChunithmPublicApi {
  constructor(public readonly http: KyInstance) {}

  /**
   * 获取歌曲列表
   */
  async getSongList(version?: number, notes?: boolean) {
    return this.http
      .get("song/list", { searchParams: { version, notes } })
      .json<Public.SongList>();
  }

  /**
   * 获取歌曲信息
   */
  async getSong(id: number, version?: number) {
    return this.http
      .get(`song/${id}`, { searchParams: { version } })
      .json<Public.SongInfo>();
  }

  /**
   * 获取歌曲别名列表
   */
  async getAliasList() {
    return this.http.get("alias/list").json<Public.AliasList>();
  }

  /**
   * 获取收藏品列表
   */
  async getCollectionList(
    collectionType: "trophy" | "character" | "plate" | "icon",
    version?: number,
  ) {
    const collectionMap = {
      trophy: "trophies",
      character: "characters",
      plate: "plates",
      icon: "icons",
    } as const;

    return this.http
      .get(`${collectionType}/list`, { searchParams: { version } })
      .json<Public.CollectionList>()
      .then((res) => res[collectionMap[collectionType]]);
  }

  /**
   * 获取收藏品信息
   */
  async getCollectionInfo(
    collectionType: "trophy" | "character" | "plate" | "icon",
    id: number,
    version?: number,
  ) {
    return this.http
      .get(`${collectionType}/${id}`, { searchParams: { version } })
      .json<Public.CollectionInfo>();
  }
}
