import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

/**
 * 关于模态框组件属性接口
 */
interface AboutModalProps {
  /** 模态框是否打开 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** Markdown 文件路径 */
  filePath: string;
}

/**
 * 关于模态框组件
 * 用于展示项目说明文档，支持渲染 Markdown
 */
const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  filePath,
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 当模态框打开时，获取 Markdown 内容
  useEffect(() => {
    if (isOpen && filePath) {
      setLoading(true);
      fetch(filePath)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`无法加载文档: ${res.status} ${res.statusText}`);
          }
          return res.text();
        })
        .then((text) => {
          setContent(text);
          setLoading(false);
        })
        .catch((err) => {
          setContent(
            `# 加载失败\n\n抱歉，无法加载文档内容。\n\n错误信息: ${err.message}`
          );
          setLoading(false);
        });
    }
  }, [isOpen, filePath]);

  if (!isOpen) return null;

  return (
    // 背景遮罩
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 模态框主体 */}
      <div
        className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden m-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // 防止点击内容区域关闭模态框
      >
        {/* 顶部标题栏 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">关于项目</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
            title="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* 内容滚动区 */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              加载中...
            </div>
          ) : (
            // markdown-body 类对应 index.css 中的自定义样式
            <div className="markdown-body">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
