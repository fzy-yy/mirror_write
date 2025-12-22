import {
  ArrowUpDown,
  Eraser,
  Eye,
  EyeOff,
  ImageMinus,
  Info,
  Maximize,
  PenTool,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import React from "react";
import { ActiveZone, ToolType } from "../types";

/**
 * Sidebar 组件属性接口
 */
interface SidebarProps {
  // --- 动作回调 ---
  /** 点击设置按钮回调 */
  onSettingsClick: () => void;
  /** 点击清除笔迹按钮回调 */
  onClearClick: () => void;
  /** 图片上传回调 */
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 切换上下书写区域回调 */
  onToggleSide: () => void;
  /** 切换是否隐藏书写区内容回调 */
  onToggleVisibility: () => void;
  /** 切换工具(画笔/橡皮)回调 */
  onToolChange: (tool: ToolType) => void;
  /** 清除背景图片回调 */
  onClearBg: () => void;
  /** 切换标签显示回调 */
  onToggleLabels: () => void;
  /** 切换全屏回调 */
  onToggleFullscreen: () => void;
  /** 点击关于回调 */
  onAboutClick: () => void;

  // --- 状态数据 ---
  /** 当前激活的书写区域 */
  activeZone: ActiveZone;
  /** 是否隐藏书写区 */
  hideActiveZone: boolean;
  /** 当前画笔颜色 */
  penColor: string;
  /** 当前选中工具 */
  currentTool: ToolType;
  /** 是否存在背景图片 */
  hasBgImage: boolean;
  /** 是否显示标签 */
  showLabels: boolean;
}

/**
 * 左侧侧边栏组件
 * 包含所有工具按钮和状态指示器
 */
const Sidebar: React.FC<SidebarProps> = ({
  onSettingsClick,
  onClearClick,
  onUploadImage,
  onToggleSide,
  onToggleVisibility,
  activeZone,
  hideActiveZone,
  penColor,
  currentTool,
  onToolChange,
  hasBgImage,
  onClearBg,
  showLabels,
  onToggleLabels,
  onToggleFullscreen,
  onAboutClick,
}) => {
  return (
    <div className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm z-30 select-none">
      {/* App Logo */}
      <div className="mb-6">
        <img
          src={import.meta.env.VITE_LOGO_PATH || "./avatar.jpg"}
          alt="App Logo"
          className="w-12 h-12 object-contain"
        />
      </div>

      <div className="flex flex-col gap-4 w-full items-center">
        {/* 画笔工具 */}
        <button
          onClick={() => {
            onToolChange("pen");
            // 双击逻辑：如果已经是选中状态，再次点击打开设置
            if (currentTool === "pen") {
              onSettingsClick();
            }
          }}
          className={`p-3 rounded-xl transition-all group relative ${
            currentTool === "pen"
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100 text-gray-500"
          }`}
          title="画笔 (选中状态下再次点击打开设置)"
        >
          <PenTool size={24} />
          {/* 颜色指示点 */}
          <span
            className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: penColor }}
          />
        </button>

        {/* 橡皮擦工具 */}
        <button
          onClick={() => {
            onToolChange("eraser");
            if (currentTool === "eraser") {
              onSettingsClick();
            }
          }}
          className={`p-3 rounded-xl transition-all ${
            currentTool === "eraser"
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100 text-gray-500"
          }`}
          title="橡皮擦 (选中状态下再次点击打开设置)"
        >
          <Eraser size={24} />
        </button>

        {/* 分隔线 */}
        <div className="w-8 h-px bg-gray-200 my-1"></div>

        {/* 切换书写区域 */}
        <button
          onClick={onToggleSide}
          className="p-3 rounded-xl hover:bg-gray-100 transition-colors flex flex-col items-center gap-1 text-gray-600"
          title={`当前书写区域: ${
            activeZone === ActiveZone.BOTTOM ? "下方" : "上方"
          }`}
        >
          <ArrowUpDown size={24} />
          <span className="text-[10px] font-medium">
            {activeZone === "BOTTOM" ? "下写" : "上写"}
          </span>
        </button>

        {/* 盲写模式开关 */}
        <button
          onClick={onToggleVisibility}
          className={`p-3 rounded-xl transition-colors ${
            hideActiveZone
              ? "bg-red-50 text-red-600"
              : "hover:bg-gray-100 text-gray-600"
          }`}
          title={
            hideActiveZone ? "显示书写区背景" : "隐藏书写区背景 (盲写模式)"
          }
        >
          {hideActiveZone ? <EyeOff size={24} /> : <Eye size={24} />}
        </button>

        {/* 标签显示开关 */}
        <button
          onClick={onToggleLabels}
          className={`p-3 rounded-xl transition-colors ${
            !showLabels ? "text-gray-400" : "hover:bg-gray-100 text-gray-600"
          }`}
          title={showLabels ? "隐藏区域提示标签" : "显示区域提示标签"}
        >
          <Tag size={24} className={!showLabels ? "opacity-50" : ""} />
        </button>

        {/* 背景图片管理 (上传/清除) */}
        {hasBgImage ? (
          <button
            onClick={onClearBg}
            className="p-3 rounded-xl hover:bg-orange-50 text-orange-500 transition-colors"
            title="清除背景图片"
          >
            <ImageMinus size={24} />
          </button>
        ) : (
          <label
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-600"
            title="上传背景图片"
          >
            <Upload size={24} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUploadImage}
            />
          </label>
        )}

        {/* 全屏按钮 (位于上传/清除按钮下方) */}
        <button
          onClick={onToggleFullscreen}
          className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          title="切换全屏模式"
        >
          <Maximize size={24} />
        </button>
      </div>

      {/* 底部功能区 */}
      <div className="mt-auto mb-4 flex flex-col gap-2 items-center">
        {/* 清除所有笔迹 */}
        <button
          onClick={onClearClick}
          className="p-3 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="一键清除所有笔迹"
        >
          <Trash2 size={24} />
        </button>

        {/* 关于按钮 (位于清除按钮下方) */}
        <button
          onClick={onAboutClick}
          className="p-3 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
          title="关于项目 / 使用说明"
        >
          <Info size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
