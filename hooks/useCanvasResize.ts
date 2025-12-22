import { RefObject, useEffect } from "react";

/**
 * 自定义 Hook: 监听容器大小变化并调整 Canvas 分辨率
 *
 * @param containerRef - 外部容器的 Ref
 * @param canvasRef - Canvas 元素的 Ref
 * @param onResize - 当尺寸发生变化时的回调函数（用于触发重绘）
 */
export const useCanvasResize = (
  containerRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  onResize: () => void
) => {
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          // 获取容器的精确逻辑像素尺寸
          const { width, height } = entry.contentRect;

          // 获取设备像素比，用于高清屏适配
          const dpr = window.devicePixelRatio || 1;

          // 设置 Canvas 的物理像素大小 (用于清晰度)
          canvas.width = width * dpr;
          canvas.height = height * dpr;

          // 设置 Canvas 的 CSS 样式大小 (用于布局)
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;

          // 缩放绘图上下文，使得后续绘图操作可以使用逻辑坐标
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.scale(dpr, dpr);
          }

          // 触发重绘回调
          onResize();
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, canvasRef, onResize]);
};
