// Note 类型
export interface Notes {
  total: number;
  tap: number;
  hold: number;
  slide: number;
  touch: number;
  break: number;
}

// SongType 枚举（字符串联合）
export type SongType = "standard" | "dx" | "utage";

// LevelIndex 枚举
export enum LevelIndex {
  BASIC = 0,
  ADVANCED = 1,
  EXPERT = 2,
  MASTER = 3,
  RE_MASTER = 4,
}

// songDifficulty 类型
export interface SongDifficulty {
  /** 类型 */
  type: SongType;
  /** 难度 */
  difficulty: LevelIndex;
  /** 等级 */
  level: string;
  /** 等级值 */
  level_value: number;
  /** 谱师 */
  note_designer: string;
  /** 版本 */
  version: number;
  /** 乐谱 */
  notes?: Notes;
}

// 宴会场 BUDDY 物量
export interface BuddyNotes {
  /** 1P 谱面物量 */
  left: Notes;
  /** 2P 谱面物量 */
  right: Notes;
}

// 宴会场谱面难度
export interface SongDifficultyUtage {
  /** 谱面属性（汉字） */
  kanji: string;
  /** 谱面描述 */
  description: string;
  /** 是否为 BUDDY 谱面 */
  is_buddy: boolean;
  /** 谱面物量（BUDDY 时为 BuddyNotes） */
  notes?: Notes | BuddyNotes;
  /** 以下与 SongDifficulty 相同 */
  type: SongType;
  difficulty: LevelIndex;
  level: string;
  level_value: number;
  note_designer: string;
  version: number;
}

// SongDifficulties 类型
export interface SongDifficulties {
  /** 标准 */
  standard: SongDifficulty[] | [];
  /** DX */
  dx: SongDifficulty[] | [];
  /** 宴会场 */
  utage?: SongDifficultyUtage[];
}

// Song 类型
export interface Song {
  /** 歌曲 ID */
  id: number;
  /** 歌曲名称 */
  title: string;
  /** 歌手 */
  artist: string;
  /** 流派 */
  genre: string;
  /** BPM */
  bpm: number;
  /** 地图 */
  map?: string;
  /** 版本 */
  version: number;
  /** 权限 */
  rights?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 难度 */
  difficulties: SongDifficulties;
  /** 锁定 */
  locked?: boolean;
}

// Genre 类型
export interface Genre {
  /** ID */
  id: number;
  /** 标题 */
  title: string;
  /** 流派 */
  genre: string;
}

// Version 类型
export interface Version {
  /** ID */
  id: number;
  /** 标题 */
  title: string;
  /** 主要版本 ID */
  version: number;
}

// Alias 类型
export interface Alias {
  /** 歌曲 ID */
  song_id: number;
  /** 别名 */
  aliases: string[] | [];
}

// 玩家 Player
export interface Player {
  /** 游戏内名称 */
  name: string;
  /** 玩家 DX Rating */
  rating: number;
  /** 好友码 */
  friend_code: number;
  /** 段位 ID */
  course_rank: number;
  /** 阶级 ID */
  class_rank: number;
  /** 搭档觉醒数 */
  star: number;
  /** 称号（仅上传时可空） */
  trophy?: Trophy;
  /** 头像 */
  icon?: Icon;
  /** 姓名框 */
  name_plate?: NamePlate;
  /** 背景 */
  frame?: Frame;
  /** 玩家被同步时的 UTC 时间（仅获取时返回） */
  upload_time?: string;
}

// 收藏品通用结构
export interface Collection {
  /** 收藏品 ID */
  id: number;
  /** 收藏品名称 */
  name: string;
  /** 称号颜色（仅玩家称号） */
  color?: string;
  /** 收藏品说明 */
  description?: string;
  /** 收藏品分类（日文，称号外） */
  genre?: string;
  /** 收藏品要求 */
  required?: CollectionRequired[];
}

export interface CollectionRequired {
  /** 要求的谱面难度，长度为 0 时代表任意难度 */
  difficulties?: LevelIndex[];
  /** 要求的评级类型 */
  rate?: RateType;
  /** 要求的 FULL COMBO 类型 */
  fc?: FCType;
  /** 要求的 FULL SYNC 类型 */
  fs?: FSType;
  /** 要求的曲目列表 */
  songs?: CollectionRequiredSong[];
  /** 要求是否全部完成 */
  completed?: boolean;
}

export interface CollectionRequiredSong {
  /** 曲目 ID */
  id: number;
  /** 曲名 */
  title: string;
  /** 谱面类型 */
  type: SongType;
  /** 要求的曲目是否完成 */
  completed?: boolean;
  /** 已完成的难度 */
  completed_difficulties?: LevelIndex[];
}

export interface CollectionGenre {
  /** 收藏品分类 ID */
  id: number;
  /** 分类标题 */
  title: string;
  /** 分类标题（日文） */
  genre: string;
}

// 枚举类型
export type FCType = "app" | "ap" | "fcp" | "fc";
export type FSType = "fsdp" | "fsd" | "fsp" | "fs" | "sync";
export type RateType =
  | "sssp"
  | "sss"
  | "ssp"
  | "ss"
  | "sp"
  | "s"
  | "aaa"
  | "aa"
  | "a"
  | "bbb"
  | "bb"
  | "b"
  | "c"
  | "d";
export type AssetType = "icon" | "plate" | "frame" | "jacket" | "music";

// 成绩 Score
export interface Score {
  /** 曲目 ID */
  id: number;
  /** 曲名（仅获取时返回） */
  song_name?: string;
  /** 难度标级，如 14+（仅获取时返回） */
  level?: string;
  /** 难度 */
  level_index: LevelIndex;
  /** 达成率 */
  achievements: number;
  /** FULL COMBO 类型 */
  fc?: FCType | null;
  /** FULL SYNC 类型 */
  fs?: FSType | null;
  /** DX 分数 */
  dx_score: number;
  /** DX 星级，最大值为 5 */
  dx_star?: number;
  /** DX Rating（仅获取时返回，计算需向下取整） */
  dx_rating?: number;
  /** 评级类型（仅获取时返回） */
  rate?: RateType;
  /** 谱面类型 */
  type: SongType;
  /** 游玩的 UTC 时间，精确到分钟 */
  play_time?: string;
  /** 成绩被同步时的 UTC 时间（仅获取时返回） */
  upload_time?: string;
  /** 谱面最后游玩的 UTC 时间（仅获取成绩列表、获取最佳成绩时返回） */
  last_played_time?: string;
}

// 简化成绩 SimpleScore
export interface SimpleScore {
  /** 曲目 ID */
  id: number;
  /** 曲名 */
  song_name: string;
  /** 难度标级，如 14+ */
  level: string;
  /** 难度 */
  level_index: LevelIndex;
  /** FULL COMBO 类型 */
  fc?: FCType | null;
  /** FULL SYNC 类型 */
  fs?: FSType | null;
  /** 评级类型 */
  rate: RateType;
  /** 谱面类型 */
  type: SongType;
}

// DX Rating 趋势
export interface RatingTrend {
  /** 总 DX Rating */
  total: number;
  /** 旧版本谱面总 DX Rating */
  standard: number;
  /** 现版本谱面总 DX Rating */
  dx: number;
  /** 日期 */
  date: string;
}

// 简单的 Trophy/Icon/NamePlate/Frame 类型占位（可按需扩展字段）
export interface Trophy extends Collection {}
export interface Icon extends Collection {}
export interface NamePlate extends Collection {}
export interface Frame extends Collection {}
