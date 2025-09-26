# 成绩模型 (Score)

<cite>
**本文档引用的文件**
- [models.ts](file://src/apis/maimai/models.ts#L231-L262)
- [dev.ts](file://src/apis/maimai/dev.ts#L42-L132)
- [personal.ts](file://src/apis/maimai/personal.ts#L34-L39)
</cite>

## 目录
1. [简介](#简介)
2. [核心字段详解](#核心字段详解)
3. [成绩查询操作](#成绩查询操作)
4. [成绩上传操作](#成绩上传操作)
5. [数据分析与实际用例](#数据分析与实际用例)
6. [典型JSON示例解析](#典型json示例解析)
7. [结论](#结论)

## 简介
本节介绍 `Score` 接口在 maimai 音游数据系统中的核心作用。该接口用于表示玩家在特定歌曲、难度下的游玩成绩，广泛应用于成绩获取（如最佳成绩、最近成绩）和成绩上传场景。通过标准化的数据结构，支持高效的成绩同步、分析与展示。

## 核心字段详解
`Score` 接口定义了多个关键字段，用于完整描述一次游玩记录：

- **id**: 对应曲目的唯一标识符（songId），关联至具体的音乐作品。
- **level_index**: 表示谱面难度等级，使用 `LevelIndex` 枚举类型：
  - `BASIC = 0`
  - `ADVANCED = 1`
  - `EXPERT = 2`
  - `MASTER = 3`
  - `RE_MASTER = 4`
- **achievements**: 达成率，浮点数值，范围通常为 0.00 到 101.00，表示本次游玩的准确度百分比。
- **rate**: 评级类型，使用 `RateType` 枚举，例如 `"sssp"`、`"sss"`、`"sp"` 等，反映达成率所对应的评价等级。
- **fc**: 连击状态（FULL COMBO 类型），使用 `FCType` 枚举，可选值包括 `"app"`、`"ap"`、`"fcp"`、`"fc"` 或 `null`。
- **fs**: 步法状态（FULL SYNC 类型），使用 `FSType` 枚举，可选值包括 `"fsdp"`、`"fsd"`、`"fsp"`、`"fs"`、`"sync"` 或 `null`。
- **dx_score**: DX 分数，整数类型，表示该次游玩获得的具体 DX 积分。
- **type**: 谱面类型，使用 `SongType` 枚举，取值为 `"standard"`、`"dx"` 或 `"utage"`。
- **play_time**: 游玩时间戳，UTC 时间格式字符串（精确到分钟），记录实际游戏发生的时间。
- **last_played_time**: 最后游玩时间，在获取成绩列表或最佳成绩时返回。
- **upload_time**: 成绩同步时间，仅在从服务器获取时返回。

这些字段共同构成了一个完整的成绩记录，适用于多种业务场景。

**Section sources**
- [models.ts](file://src/apis/maimai/models.ts#L231-L262)

## 成绩查询操作
系统提供多种方式查询用户的成绩数据，主要通过以下两个接口实现：

### 获取最佳成绩 (getBests)
调用 `getBests(friendCode: number)` 方法可获取指定好友码用户的 Best 50 成绩（包含 standard 35 首 + dx 15 首）。此方法返回的成绩数组已按 DX Rating 排序，每条记录均为完整的 `Score` 对象，包含所有字段信息。

### 获取最近成绩 (getRecents)
调用 `getRecents(friendCode: number)` 方法可获取用户最近游玩的 50 条成绩记录。此接口主要用于增量更新和历史追踪，返回的成绩中通常包含 `play_time` 字段以标识具体游玩时间。

上述查询操作均会填充 `song_name`、`level`、`dx_rating`、`rate` 等“仅获取时返回”的字段，便于前端直接展示。

**Section sources**
- [dev.ts](file://src/apis/maimai/dev.ts#L42-L44)
- [dev.ts](file://src/apis/maimai/dev.ts#L60-L62)

## 成绩上传操作
成绩上传功能允许客户端将本地成绩批量提交至服务器，支持开发者模式和个人模式两种路径。

### 开发者模式上传
通过 `postScores(friendCode: number, scores: Score[])` 方法，开发者可以为指定用户上传一组成绩。请求体需包含 `scores` 数组，每个元素符合 `Score` 接口规范。服务器将验证并存储这些成绩，用于后续查询与分析。

### 个人模式上传
用户可通过身份认证后调用 `postScores(scores: Score[])` 方法上传自己的成绩。此接口位于 `/api/v0/user/maimai/player/scores`，同样接收 `Score[]` 数组作为输入。

两种上传方式均要求 `Score` 对象至少包含必要字段（如 `id`, `level_index`, `achievements`, `dx_score`, `type`），推荐尽可能提供完整信息以便系统准确计算 Rating 和星级。

**Section sources**
- [dev.ts](file://src/apis/maimai/dev.ts#L127-L132)
- [personal.ts](file://src/apis/maimai/personal.ts#L34-L39)

## 数据分析与实际用例
对 `Score` 数组进行解析可用于多种数据分析场景：

### 计算平均达成率
遍历 `Score[]` 数组，提取所有 `achievements` 值并求平均，可评估玩家整体表现水平。

### 统计连击完成情况
统计 `fc` 字段中 `"app"`、`"ap"` 等值的出现频率，分析玩家 FULL COMBO 的达成能力。

### 分析成绩分布趋势
结合 `play_time` 与 `dx_rating`（若可计算），绘制时间序列图，观察玩家技术成长趋势。

### 构建热力图
利用 `play_time` 提取日期部分（YYYY-MM-DD），统计每日游玩次数，生成成绩上传热力图，反映活跃度模式。

### 识别目标突破
比较当前成绩与目标 `RateType`（如 "sssp"）的要求，定位尚未达标的高难度曲目，指导练习方向。

这些分析依赖于结构化且一致的 `Score` 模型，确保跨设备、跨平台数据的一致性与可比性。

**Section sources**
- [models.ts](file://src/apis/maimai/models.ts#L231-L262)
- [dev.ts](file://src/apis/maimai/dev.ts#L127-L132)

## 典型JSON示例解析
```json
{
  "id": 1001,
  "song_name": "彩る世界",
  "level": "14+",
  "level_index": 3,
  "achievements": 99.123456,
  "fc": "fcp",
  "fs": null,
  "dx_score": 923456,
  "dx_star": 5,
  "dx_rating": 15800,
  "rate": "ss",
  "type": "dx",
  "play_time": "2023-12-01T15:30Z",
  "upload_time": "2023-12-01T15:32:15Z",
  "last_played_time": "2023-12-01T15:30Z"
}
```

**各字段业务含义标注：**
- `id`: 曲目ID，对应《彩る世界》
- `song_name`: 曲名，仅查询时返回
- `level`: 难度标级显示为“14+”
- `level_index`: 实际难度为 MASTER (3)
- `achievements`: 达成率为 99.12%
- `fc`: 达成 FCP（Full Combo Perfect）
- `fs`: 未达成 Full Sync
- `dx_score`: 获得 DX 分数 923,456
- `dx_star`: 获得满星评级（5星）
- `dx_rating`: 此成绩贡献约 15,800 Rating
- `rate`: 评级为 SS
- `type`: 属于 DX 谱面
- `play_time`: 实际游玩时间为 2023年12月1日 15:30 UTC
- `upload_time`: 成绩同步至服务器时间为 15:32 UTC
- `last_played_time`: 该谱面最后游玩时间

此示例展示了高水准玩家的一次典型游玩记录，可用于排行榜计算、成就解锁等场景。

**Section sources**
- [models.ts](file://src/apis/maimai/models.ts#L231-L262)

## 结论
`Score` 接口是 maimai 数据系统的核心组成部分，其设计兼顾了数据完整性与传输效率。通过对 `songId`、`difficulty`（即 `level_index`）、`achievement`、`rate`、`fc`、`fs`、`dxScore`、`timestamp` 等关键字段的精确定义，实现了成绩的标准化表达。无论是用于 `getBests`、`getRecents` 的查询，还是 `postScores` 的上传，该模型都提供了坚实的基础。结合实际数据分析用例，能够深入挖掘玩家行为模式，提升用户体验与系统智能化水平。