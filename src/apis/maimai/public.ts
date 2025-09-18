import type * as Public from "./types/public.js";
import type { KyInstance } from "ky";
import { Song } from "./entities/Song.js";

/**
 * maimai 公共 API
 */
export class MaimaiPublicApi {
  constructor(private readonly http: KyInstance) {}

  /**
   * 获取歌曲列表
   * @param version 版本，不填写遵循api默认行为
   * @param notes 是否包含谱面信息，不填写遵循api默认行为
   * @returns 歌曲列表
   */
  async getSongList(version?: number, notes?: boolean) {
    return this.http
      .get("song/list?", { searchParams: { version, notes } })
      .json<Public.SongList>();
  }

  /**
   * 获取歌曲信息
   * @param id 歌曲 ID
   * @returns 歌曲信息
   */
  async getSong(id: number) {
    const songInfo = await this.http.get(`song/${id}`).json<Public.SongInfo>();
    return new Song(songInfo);
  }

  /**
   * 获取歌曲别名列表
   * @returns 歌曲别名列表
   */
  async getAliasList() {
    return this.http.get("alias/list").json<Public.AliasList>();
  }

  /**
   * 获取收藏品列表
   * @param collectionType trophy | icon | plate | frame
   * @param options.version 版本，不填写遵循api默认行为
   * @param options.required 是否包含曲目需求，默认值为 false
   * @returns 收藏品列表
   */
  async getCollectionList(
    collectionType: "trophy" | "icon" | "plate" | "frame",
    options?: { version?: number; required?: boolean }
  ) {
    const collectionMap = {
      trophy: "trophies",
      icon: "icons",
      plate: "plates",
      frame: "frames",
    } as const;
    return this.http
      .get(`${collectionType}/list`, { searchParams: { ...options } })
      .json<Public.CollectionList>()
      .then(res => res[collectionMap[collectionType]]);
  }

  /**
   * 获取收藏品信息
   * @param collectionType trophy | icon | plate | frame
   * @param id 收藏品 ID
   * @param options.version 版本，不填写遵循api默认行为
   * @returns 收藏品信息
   */
  async getCollectionInfo(
    collectionType: "trophy" | "icon" | "plate" | "frame",
    id: number,
    options?: { version?: number }
  ) {
    return this.http
      .get(`${collectionType}/${id}`, { searchParams: { ...options } })
      .json<Public.CollectionInfo>();
  }

  /**
   * 获取收藏品分类列表
   * @param options.version 版本，不填写遵循api默认行为
   * @returns 收藏品分类列表
   */
  async getCollectionGenreList(options?: { version?: number }) {
    return this.http
      .get("collection-genre/list", { searchParams: { ...options } })
      .json<Public.CollectionGenreList>();
  }

  /**
   * 获取收藏品分类信息
   * @param id 收藏品分类 ID
   * @param options.version 版本，不填写遵循api默认行为
   * @returns 收藏品分类信息
   */
  async getCollectionGenreInfo(id: number, options?: { version?: number }) {
    return this.http
      .get(`collection-genre/${id}`, { searchParams: { ...options } })
      .json<Public.CollectionGenreInfo>();
  }
}
