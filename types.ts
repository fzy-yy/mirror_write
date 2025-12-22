// --- 类型定义文件 ---

// 定义坐标点结构
// x和y均为 0-1 之间的归一化数值，不依赖具体像素大小，实现响应式缩放
export interface Point {
  /** 归一化 X 坐标 (0.0 - 1.0) */
  x: number;
  /** 归一化 Y 坐标 (0.0 - 1.0) */
  y: number;
}

// 定义单笔画结构
export interface Stroke {
  /** 笔画包含的点集合 */
  points: Point[];
  /** 笔画颜色 (Hex string) */
  color: string;
  /** 笔画粗细 (像素值，绘制时会根据画布比例进行调整) */
  width: number;
  /** 是否为橡皮擦笔迹 (true为擦除，false为绘制) */
  isEraser?: boolean;
}

// 定义上下区域的枚举
export enum ActiveZone {
  /** 上半部分区域 */
  TOP = "TOP",
  /** 下半部分区域 */
  BOTTOM = "BOTTOM",
}

// 工具类型
export type ToolType = "pen" | "eraser";
