import React, { useState } from "react";
import AboutModal from "./components/AboutModal";
import CanvasZone from "./components/CanvasZone";
import SettingsModal from "./components/SettingsModal";
import Sidebar from "./components/Sidebar";
import { ActiveZone, Point, Stroke, ToolType } from "./types";

/**
 * 应用程序主入口组件
 * 负责全局状态管理和布局组合
 */
const App: React.FC = () => {
  // --- 全局状态管理 ---

  // 所有笔画的历史数据
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  // 当前正在绘制的临时笔画
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  // 工具设置状态
  const [currentTool, setCurrentTool] = useState<ToolType>("pen");
  const [penColor, setPenColor] = useState<string>("#000000");
  const [penWidth, setPenWidth] = useState<number>(4);
  const [eraserWidth, setEraserWidth] = useState<number>(20);

  // 界面显示状态
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false); // 关于模态框状态
  const [bgImage, setBgImage] = useState<string>(
    import.meta.env.VITE_DEFAULT_IMAGE_PATH || ""
  );
  const [activeZone, setActiveZone] = useState<ActiveZone>(ActiveZone.BOTTOM);
  const [hideActiveZone, setHideActiveZone] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // --- 交互逻辑处理 ---

  /**
   * 处理鼠标/触摸按下事件
   * 创建新的笔画对象并开始记录
   */
  const handlePointerDown = (
    e: React.PointerEvent<HTMLCanvasElement>,
    point: Point
  ) => {
    // 仅响应鼠标左键或触摸笔/手指
    if (e.pointerType === "mouse" && e.buttons !== 1) return;

    // 捕获指针，防止移出画布后事件丢失
    e.currentTarget.setPointerCapture(e.pointerId);

    // 初始化新笔画
    const newStroke: Stroke = {
      points: [point],
      color: penColor,
      width: currentTool === "eraser" ? eraserWidth : penWidth,
      isEraser: currentTool === "eraser",
    };

    setCurrentStroke(newStroke);
  };

  /**
   * 处理鼠标/触摸移动事件
   * 将新坐标添加到当前笔画中
   */
  const handlePointerMove = (
    e: React.PointerEvent<HTMLCanvasElement>,
    point: Point
  ) => {
    if (!currentStroke) return;

    // 再次检查鼠标按键状态，防止异常情况
    if (e.pointerType === "mouse" && e.buttons !== 1) {
      // 异常断开视作结束绘制
      setStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke(null);
      return;
    }

    // 更新当前笔画数据
    setCurrentStroke((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, point],
      };
    });
  };

  /**
   * 处理鼠标/触摸抬起事件
   * 结束绘制，将临时笔画保存到历史记录
   */
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStroke) return;

    setStrokes((prev) => [...prev, currentStroke]);
    setCurrentStroke(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // --- 辅助功能函数 ---

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgImage(url);
    }
  };

  // 清空所有笔画
  const handleClearStrokes = () => {
    setStrokes([]);
    setCurrentStroke(null);
  };

  // 切换全屏模式
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="flex w-screen h-dvh bg-gray-100 overflow-hidden font-sans text-gray-800">
      {/* 左侧功能栏 */}
      <Sidebar
        activeZone={activeZone}
        hideActiveZone={hideActiveZone}
        penColor={penColor}
        currentTool={currentTool}
        hasBgImage={!!bgImage}
        showLabels={showLabels}
        onSettingsClick={() => setShowSettings(true)}
        onClearClick={handleClearStrokes}
        onUploadImage={handleImageUpload}
        onToggleSide={() =>
          setActiveZone((prev) =>
            prev === ActiveZone.TOP ? ActiveZone.BOTTOM : ActiveZone.TOP
          )
        }
        onToggleVisibility={() => setHideActiveZone(!hideActiveZone)}
        onToolChange={setCurrentTool}
        onClearBg={() => setBgImage("")}
        onToggleLabels={() => setShowLabels(!showLabels)}
        onToggleFullscreen={handleToggleFullscreen}
        onAboutClick={() => setShowAbout(true)}
      />

      {/* 设置面板 (含遮罩层) */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setShowSettings(false)}
          />
          <SettingsModal
            color={penColor}
            width={currentTool === "eraser" ? eraserWidth : penWidth}
            isEraser={currentTool === "eraser"}
            onColorChange={setPenColor}
            onWidthChange={
              currentTool === "eraser" ? setEraserWidth : setPenWidth
            }
            onClose={() => setShowSettings(false)}
          />
        </>
      )}

      {/* 关于面板 (Markdown 渲染) */}
      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        filePath={import.meta.env.VITE_ABOUT_DOC_PATH || "./README.md"}
      />

      {/* 主画布区域容器 */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* 上半部分画布 */}
        <CanvasZone
          zoneType={ActiveZone.TOP}
          activeZone={activeZone}
          isHidden={hideActiveZone}
          bgImage={bgImage}
          strokes={strokes}
          currentStroke={currentStroke}
          showLabel={showLabels}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />

        {/* 分割线 */}
        <div className="h-px w-full bg-gray-300 z-20 shrink-0"></div>

        {/* 下半部分画布 */}
        <CanvasZone
          zoneType={ActiveZone.BOTTOM}
          activeZone={activeZone}
          isHidden={hideActiveZone}
          bgImage={bgImage}
          strokes={strokes}
          currentStroke={currentStroke}
          showLabel={showLabels}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>
    </div>
  );
};

export default App;
