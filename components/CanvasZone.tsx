import React, { useCallback, useRef } from "react";
import { useCanvasResize } from "../hooks/useCanvasResize";
import { ActiveZone, Stroke } from "../types";
import { drawStroke, getNormalizedPoint } from "../utils/drawUtils";

/**
 * CanvasZone 组件的属性接口
 */
interface CanvasZoneProps {
  /** 区域标识 (TOP 或 BOTTOM) */
  zoneType: ActiveZone;
  /** 当前激活的区域 (决定是否响应鼠标事件) */
  activeZone: ActiveZone;
  /** 是否隐藏内容 (盲写模式) */
  isHidden: boolean;
  /** 背景图片 URL */
  bgImage: string;
  /** 所有的笔画数据 */
  strokes: Stroke[];
  /** 当前正在绘制的笔画 (临时笔画) */
  currentStroke: Stroke | null;
  /** 是否显示区域标签 */
  showLabel: boolean;
  /** 鼠标按下处理函数 */
  onPointerDown: (
    e: React.PointerEvent<HTMLCanvasElement>,
    point: ReturnType<typeof getNormalizedPoint>
  ) => void;
  /** 鼠标移动处理函数 */
  onPointerMove: (
    e: React.PointerEvent<HTMLCanvasElement>,
    point: ReturnType<typeof getNormalizedPoint>
  ) => void;
  /** 鼠标抬起/离开处理函数 */
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
}

/**
 * 画布区域组件
 * 封装了：背景图显示、标签显示、Canvas渲染、事件监听、尺寸自适应
 */
const CanvasZone: React.FC<CanvasZoneProps> = ({
  zoneType,
  activeZone,
  isHidden,
  bgImage,
  strokes,
  currentStroke,
  showLabel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 判断当前组件是否是镜像显示的
  // 逻辑：如果当前激活的是 Bottom，则 Top 显示镜像；反之亦然
  const isMirror = activeZone !== zoneType;

  // 判断当前组件是否是激活的书写区
  const isActiveWritingZone = activeZone === zoneType;

  // 判断是否应该显示内容
  // 如果是激活区且开启了隐藏模式，则显示白板
  const shouldShowContent = !(isActiveWritingZone && isHidden);

  /**
   * 核心渲染函数
   * 负责将所有的笔画绘制到 Canvas 上
   */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!shouldShowContent) return;

    // 获取 DPR 和 逻辑宽高
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = canvas.width / dpr;
    const logicalHeight = canvas.height / dpr;

    // 绘制所有已保存的笔画
    strokes.forEach((stroke) => {
      drawStroke(ctx, stroke, logicalWidth, logicalHeight, isMirror);
    });

    // 绘制当前正在进行的笔画
    if (currentStroke) {
      drawStroke(ctx, currentStroke, logicalWidth, logicalHeight, isMirror);
    }
  }, [strokes, currentStroke, isMirror, shouldShowContent]);

  // 使用自定义 Hook 处理尺寸变化，并自动触发 render
  useCanvasResize(containerRef, canvasRef, render);

  // 当数据变化时，触发重绘
  React.useEffect(() => {
    render();
  }, [render]);

  // 事件包装器：将原始事件转换为归一化坐标传给父组件
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isActiveWritingZone) return;
    const point = getNormalizedPoint(e);
    onPointerDown(e, point);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isActiveWritingZone) return;
    const point = getNormalizedPoint(e);
    onPointerMove(e, point);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex-1 min-h-0 overflow-hidden
        ${shouldShowContent ? "bg-gray-50" : "bg-white"}`}
    >
      {/* 背景图片层 */}
      {bgImage && shouldShowContent && (
        <img
          src={bgImage}
          alt={`background-${zoneType}`}
          className={`absolute top-0 left-0 w-full h-full object-fill pointer-events-none select-none z-0 ${
            isMirror ? "scale-y-[-1]" : ""
          }`}
        />
      )}

      {/* 区域指示标签 */}
      {showLabel && (
        <div
          className={`absolute top-2 left-2 px-2 py-1 text-xs rounded z-20 pointer-events-none select-none ${
            isActiveWritingZone
              ? "bg-[#8571FE] text-white"
              : "bg-black/10 text-gray-600"
          }`}
        >
          {isActiveWritingZone ? "写字区" : "显示区"}
        </div>
      )}

      {/* Canvas 绘图层 */}
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full z-10 touch-none block
          ${
            isActiveWritingZone
              ? "pointer-events-auto cursor-crosshair"
              : "pointer-events-none"
          }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={isActiveWritingZone ? onPointerUp : undefined}
        onPointerLeave={isActiveWritingZone ? onPointerUp : undefined}
      />
    </div>
  );
};

export default CanvasZone;
