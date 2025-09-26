# 公共API参考

<cite>
**本文档中引用的文件**
- [public.ts](file://src/apis/maimai/public.ts)
- [types/public.ts](file://src/apis/maimai/types/public.ts)
- [models.ts](file://src/apis/maimai/models.ts)
- [Song.ts](file://src/apis/maimai/entities/Song.ts)
</cite>

## 目录
1. [简介](#简介)
2. [数据模型](#数据模型)
3. [API端点参考](#api端点参考)
   1. [获取歌曲列表 (getSongList)](#获取歌曲列表-getSongList)
   2. [获取歌曲信息 (getSong)](#获取歌曲信息-getSong)
   3. [获取歌曲别名列表 (getAliasList)](#获取歌曲别名列表-getAliasList)
   4. [获取收藏品列表 (getCollectionList)](#获取收藏品列表-getCollectionList)
   5. [获取收藏品信息 (getCollectionInfo)](#获取收藏品信息-getCollectionInfo)
   6. [获取收藏品分类列表 (getCollectionGenreList)](#获取收藏品分类列表-getCollectionGenreList)
   7. [获取收藏品分类信息 (getCollectionGenreInfo)](#获取收藏品分类信息-getCollectionGenreInfo)

## 简介
本文档为 `maimai.public` 命名空间下的所有公共API端点提供详尽的技术参考。所有接口均无需任何认证即可访问，适用于开发者快速集成和查询maimai游戏相关数据。

**Section sources**
- [public.ts](file://src/apis/maimai/public.ts#L1-L10)

## 数据模型
本节定义了API响应中使用的核心数据结构。

### Song 实体
`getSong` 方法返回一个封装后的 `Song` 对象，该对象基于 `models.ts` 中定义的 `Song` 接口，并提供了便捷的属性访问器。

```typescript
interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  version: number;
  rights?: string;
  disabled?: boolean;
  difficulties: SongDifficulties;
  locked?: boolean;
}
```

`Song` 类（位于 `entities/Song.ts`）对原始数据进行了增强，提供了以下只读属性：
- **standard**: 返回一个以难度级别（basic, advanced, expert, master, remaster）为键的对象，包含标准谱面信息。
- **dx**: 返回DX谱面信息，结构同上。
- **utage**: 返回宴会场谱面信息。

当对应类型的谱面不存在时，这些属性返回 `null`。

**Section sources**
- [models.ts](file://src/apis/maimai/models.ts#L78-L101)
- [Song.ts](file://src/apis/maimai/entities/Song.ts#L22-L64)

### Collection 收藏品通用结构
所有收藏品（称号、头像、姓名框、背景）共享此基础结构。

```typescript
interface Collection {
  id: number;
  name: string;
  color?: string;
  description?: string;
  genre?: string;
  required?: CollectionRequired[];
}
```

**Section sources**
- [models.ts](file://src/apis/maimai/models.ts#L159-L166)

## API端点参考

### 获取歌曲列表 (getSongList)
获取完整的歌曲列表。

**HTTP请求**
- **方法**: GET
- **路径**: `/song/list`

**请求参数**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| `version` | number | 否 | 遵循API默认行为 | 过滤指定版本的歌曲 |
| `notes` | boolean | 否 | 遵循API默认行为 | 是否在响应中包含详细的谱面物量信息 |

**响应数据**
```json
{
  "songs": [
    {
      "id": 114,
      "title": "光る",
      "artist": "cosMo@暴走P",
      "genre": "ELECTRONICA",
      "bpm": 180,
      "version": 1,
      "difficulties": {
        "standard": [...],
        "dx": [...]
      }
    }
  ],
  "genres": [...],
  "versions": [...]
}
```
- **类型**: `Public.SongList` (来自 `types/public.ts`)
- **说明**: 响应包含 `songs`（歌曲数组）、`genres`（流派列表）和 `versions`（版本列表）三个字段。

**可能的状态码**
- `200 OK`: 请求成功，返回歌曲列表。

**调用示例**
```typescript
const client = new LxnsApiClient();
const songList = await client.maimai.public.getSongList(5, true);
console.log(songList.songs.length);
```

**Section sources**
- [public.ts](file://src/apis/maimai/public.ts#L15-L22)
- [types/public.ts](file://src/apis/maimai/types/public.ts#L4-L9)

### 获取歌曲信息 (getSong)
根据ID获取单首歌曲的详细信息。

**HTTP请求**
- **方法**: GET
- **路径**: `/song/{id}`

**路径参数**
| 参数 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | number | 是 | 歌曲的唯一标识符 |

**响应数据**
返回一个经过封装的 `Song` 实体对象。
- **类型**: `Song` (来自 `entities/Song.ts` 的类实例)

**可能的状态码**
- `200 OK`: 请求成功，返回歌曲信息。
- `404 Not Found`: 指定ID的歌曲不存在。

**调用示例**
```typescript
const client = new LxnsApiClient();
const song = await client.maimai.public.getSong(114);
// 访问DX谱面大师难度
console.log(song.dx?.master.level); // 输出类似 "14+"
```

**Section sources**
- [public.ts](file://src/apis/maimai/public.ts#L24-L30)
- [types/public.ts](file://src/apis/maimai/types/public.ts#L11-L13)
- [models.ts](file://src/apis/maimai/models.ts#L78-L101)
- [Song.ts](file://src/apis/maimai/entities/Song.ts#L22-L64)

### 获取歌曲别名列表 (getAliasList)
获取所有歌曲的别名映射列表。

**HTTP请求**
- **方法**: GET
- **路径**: `/alias/list`

**请求参数**
无

**响应数据**
```json
{
  "aliases": [
    {
      "song_id": 114,
      "aliases": ["Hikaru", "Koori"]
    }
  ]
}
```
- **类型**: `Public.AliasList` (来自 `types/public.ts`)
- **说明**: 返回一个数组，每个元素包含 `song_id` 和其对应的别名字符串数组。

**可能的状态码**
- `200 OK`: 请求成功，返回别名列表。

**调用示例**
```typescript
const client = new LxnsApiClient();
const aliasList = await client.maimai.public.getAliasList();
const hikaruAliases = aliasList.aliases.find(a => a.song_id === 114)?.aliases;
```

**Section sources**
- [public.ts](file://src/apis/maimai/public.ts#L32-L37)
- [types/public.ts](file://src/apis/maimai/types/public.ts#L15-L18)

### 获取收藏品列表 (getCollectionList)
获取指定类型的收藏品列表。

**HTTP请求**
- **方法**: GET
- **路径**: `/{collectionType}/list`

**路径参数**
| 参数 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `collectionType` | string | 是 | 收藏品类型，可选值：`trophy`, `icon`, `plate`, `frame` |

**查询参数**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| `version` | number | 否 | 遵循API默认行为 | 过滤指定版本的收藏品 |
| `required` | boolean | 否 | false | 是否在响应中包含获取该收藏品的具体要求 |

**响应数据**
直接返回指定 `collectionType` 的收藏品数组。
- **类型**: `Models.Collection[]`
- **说明**: 响应是 `CollectionList` 类型的一个子集，例如请求 `trophy` 类型会返回 `trophies` 数组中的内容。

**可能的状态码**
- `200 OK`: 请求成功，返回收藏品列表。

**调用示例**
```typescript
const client = new LxnsApiClient();
// 获取所有称号
const trophies = await client.maimai.public.getCollectionList("trophy");
// 获取需要特定条件才能获得的头像
const icons = await client.maimai.public.getCollectionList("icon", { required: true });
```

**Section sources**
- [public.ts](file://src/apis/maimai/public.ts#L39-L57)
- [types/public.ts](file://src/apis/maimai/types/public.ts#L20-L23)

### 获取收藏品信息 (getCollectionInfo)
根据ID获取单个收藏品的详细信息。

**HTTP请求**
- **方法**: GET
- **路径**: `/{collectionType}/{id}`

**路径参数**
| 参数 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `collectionType` | string | 是 | 收藏品类型，可选值：`trophy`, `icon`, `plate`, `frame` |
| `id` | number | 是 | 收藏品的唯一标识符 |

**查询参数**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| `version` | number | 否 | 遵循API默认行为 | 过滤指定版本的收藏品信息 |

**响应数据**
返回一个 `Collection` 对象。
- **类型**: `Public.CollectionInfo` (即 `Models.Collection`)

**可能的状态码**
- `200 OK`: 请求成功，返回收藏品信息。
- `404 Not Found`: 指定类型或ID的收藏品不存在。

**调用示例**
```typescript
const client = new LxnsApiClient();
const trophyInfo = await client.maimai.public.getCollectionInfo("trophy", 1001);
console.log(trophyInfo.name, trophyInfo.description);
```

**Section sources**
- [public.ts](file://src/apis/maimai/public.ts#L59-L71)
- [types/public.ts](file://src/apis/maimai/types/public.ts#L25-L27)

### 获取收藏品分类列表 (getCollectionGenreList)
获取所有收藏品分类的列表。

**HTTP请求**
- **方法**: GET
- **路径**: `/collection-genre/list`

**查询参数**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| `version` | number | 否 | 遵循API默认行为 | 过滤指定版本的分类 |

**响应数据**
```json
{
  "collectionGenres": [
    {
      "id": 1,
      "title": "段位称号",
      "genre": "Course Trophy"
    }
  ]
}
```
- **类型**: `Public.CollectionGenreList`
- **设计意图**: 此接口用于获取如“段位称号”、“等级称号”等大类别的元信息，帮助客户端组织和展示收藏品。它与具体的收藏品（如某个段位称号）形成层级关系。

**可能的状态码**
- `200 OK`: 请求成功，返回分类列表。

**调用示例**
```typescript
const client = new LxnsApiClient();
const genres = await client.maimai.public.getCollectionGenreList();
console.log(genres.collectionGenres);
```

**Section sources**
- [public.ts](file://src/apis/maimai/public.ts#L73-L82)
- [types/public.ts](file://src/apis/maimai/types/public.ts#L29-L31)

### 获取收藏品分类信息 (getCollectionGenreInfo)
根据ID获取单个收藏品分类的详细信息。

**HTTP请求**
- **方法**: GET
- **路径**: `/collection-genre/{id}`

**路径参数**
| 参数 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | number | 是 | 收藏品分类的唯一标识符 |

**查询参数**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| `version` | number | 否 | 遵循API默认行为 | 过滤指定版本的分类信息 |

**响应数据**
返回一个 `CollectionGenre` 对象。
- **类型**: `Public.CollectionGenreInfo` (即 `Models.CollectionGenre`)

**可能的状态码**
- `200 OK`: 请求成功，返回分类信息。
- `404 Not Found`: 指定ID的分类不存在。

**调用示例**
```typescript
const client = new LxnsApiClient();
const genreInfo = await client.maimai.public.getCollectionGenreInfo(1);
console.log(genreInfo.title);
```

**Section sources**
- [public.ts](file://src/apis/maimai/public.ts#L84-L94)
- [types/public.ts](file://src/apis/maimai/types/public.ts#L33-L35)