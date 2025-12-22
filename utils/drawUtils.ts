import React from "react";
import { Point, Stroke } from "../types";

/**
 * 绘制单个笔画的核心函数
 *
 * @param ctx - Canvas 2D 绘图上下文
 * @param stroke - 笔画数据对象
 * @param width - 画布的逻辑宽度 (CSS像素)
 * @param height - 画布的逻辑高度 (CSS像素)
 * @param isMirror - 是否需要进行垂直镜像翻转
 */
export const drawStroke = (
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  width: number,
  height: number,
  isMirror: boolean
) => {
  // 如果没有点，则不绘制
  if (stroke.points.length < 1) return;

  ctx.beginPath();
  // 设置线条两端为圆形，转角为圆形，使笔迹平滑
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // 根据是否是橡皮擦设置混合模式
  if (stroke.isEraser) {
    // destination-out 会擦除目标区域的像素，使其变透明
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)"; // 颜色不重要，关键是Alpha通道
  } else {
    // source-over 是默认的覆盖绘制模式
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color;
  }

  ctx.lineWidth = stroke.width;

  // 处理起始点
  const p0 = stroke.points[0];
  const startX = p0.x * width;
  // 如果是镜像模式，Y轴坐标需要反转 (1 - y)
  const startY = isMirror ? (1 - p0.y) * height : p0.y * height;

  ctx.moveTo(startX, startY);

  // 特殊处理：如果只有一个点（用户只是点击了一下），也需要绘制出来
  if (stroke.points.length === 1) {
    // lineTo 到同一个点触发 lineCap='round' 绘制出一个圆点
    ctx.lineTo(startX, startY);
  } else {
    // 连接后续所有的点
    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      const x = p.x * width;
      const y = isMirror ? (1 - p.y) * height : p.y * height;
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // 绘制完成后重置混合模式，防止影响下一次绘制
  ctx.globalCompositeOperation = "source-over";
};

/**
 * 获取鼠标/触摸事件在 Canvas 中的归一化坐标 (0-1)
 *
 * @param e - 鼠标或触摸事件
 * @returns 归一化的 Point 对象
 */
export const getNormalizedPoint = (
  e: React.PointerEvent<HTMLCanvasElement>
): Point => {
  const canvas = e.currentTarget;
  // 获取 Canvas 元素相对于视口的位置和大小
  const rect = canvas.getBoundingClientRect();

  return {
    // 计算相对坐标并归一化
    x: (e.clientX - rect.left) / rect.width,
    y: (e.clientY - rect.top) / rect.height,
  };
};
