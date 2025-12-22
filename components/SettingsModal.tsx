import { X } from "lucide-react";
import React from "react";

/**
 * 设置模态框属性接口
 */
interface SettingsModalProps {
  /** 当前选中的颜色 */
  color: string;
  /** 当前选中的粗细 */
  width: number;
  /** 是否为橡皮擦模式 (影响界面文案和选项) */
  isEraser: boolean;
  /** 颜色变更回调 */
  onColorChange: (color: string) => void;
  /** 粗细变更回调 */
  onWidthChange: (width: number) => void;
  /** 关闭模态框回调 */
  onClose: () => void;
}

// 常用颜色预设列表
const PRESET_COLORS = [
  "#000000",
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#808080",
];

/**
 * 画笔/橡皮擦参数设置悬浮窗
 */
const SettingsModal: React.FC<SettingsModalProps> = ({
  color,
  width,
  isEraser,
  onColorChange,
  onWidthChange,
  onClose,
}) => {
  return (
    // 使用 animate-in 动画类实现出现时的过渡效果
    <div className="absolute top-20 left-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-200 z-50 w-64 animate-in fade-in zoom-in duration-200">
      {/* 标题栏 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700">
          {isEraser ? "橡皮擦设置" : "画笔设置"}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      {/* 粗细调节区域 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-2">
          {isEraser ? "擦除大小" : "笔迹粗细"}: {width}px
        </label>

        {/* 滑动条控件 */}
        <input
          type="range"
          min="1"
          max={isEraser ? "100" : "50"}
          value={width}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onWidthChange(Number(e.target.value))
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        {/* 粗细实时预览窗口 */}
        <div className="mt-2 flex items-center justify-center h-32 bg-gray-50 rounded border border-gray-100 overflow-hidden">
          {isEraser ? (
            // 橡皮擦预览 (空心圆)
            <div
              className="rounded-full border border-gray-400 bg-white"
              style={{ width: `${width}px`, height: `${width}px` }}
            />
          ) : (
            // 画笔预览 (实心圆，带颜色)
            <div
              className="rounded-full bg-black"
              style={{
                width: `${width}px`,
                height: `${width}px`,
                backgroundColor: color,
              }}
            />
          )}
        </div>
      </div>

      {/* 颜色选择区域 (仅在画笔模式下显示) */}
      {!isEraser && (
        <div>
          <label className="block text-sm text-gray-500 mb-2">颜色</label>

          {/* 预设颜色网格 */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                // 选中状态添加蓝色边框环
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* 自定义颜色拾取器 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">自定义:</span>
            <input
              type="color"
              value={color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onColorChange(e.target.value)
              }
              className="w-full h-8 cursor-pointer rounded border border-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModal;
