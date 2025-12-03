import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, ProcessedFrame } from "../types";

const API_KEY_STORAGE_KEY = 'vloglens_gemini_api_key';

// 延迟初始化 SDK，避免在模块加载时就报错导致整个应用崩溃
let ai: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

// 获取 API Key：优先从 localStorage，其次从环境变量
export function getApiKey(): string | null {
  // 优先使用 localStorage 中的 key
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedKey) {
    return storedKey;
  }
  // 其次使用环境变量（构建时注入）
  return process.env.API_KEY || null;
}

// 检查是否已配置 API Key
export function hasApiKey(): boolean {
  return !!getApiKey();
}

// 重置 AI 实例（当 API Key 变化时调用）
export function resetAI(): void {
  ai = null;
  currentApiKey = null;
}

function getAI(): GoogleGenAI {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("请先设置 Gemini API 密钥。点击右上角的设置按钮进行配置。");
  }
  
  // 如果 API Key 变化了，重新初始化
  if (ai && currentApiKey !== apiKey) {
    ai = null;
  }
  
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
    currentApiKey = apiKey;
  }
  
  return ai;
}

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Vlog的标题，吸引人，适合社交媒体。",
    },
    mood: {
      type: Type.STRING,
      description: "2-3个词描述视频的氛围或心情 (例如：'惬意午后', '热血运动', '治愈瞬间')。",
    },
    diary_blocks: {
      type: Type.ARRAY,
      description: "视觉日记的时间轴内容。将视频拆分为几个关键时刻。",
      items: {
        type: Type.OBJECT,
        properties: {
          time_label: { type: Type.STRING, description: "时间点或时刻名称 (例如 '10:30' 或 '出发时刻')" },
          text: { type: Type.STRING, description: "关于这个时刻的日记描述，生动有趣，中文。" },
          emoji: { type: Type.STRING, description: "代表这个时刻的一个 Emoji。" },
          frame_index: { 
            type: Type.INTEGER, 
            description: "提供的图片列表中，最能代表这个时刻的那张图片的索引 (index)，从 0 开始。" 
          }
        },
        required: ["time_label", "text", "emoji", "frame_index"]
      }
    },
    social_caption: {
      type: Type.STRING,
      description: "一篇完整的小红书/Instagram风格文案。包含标题、正文、Emoji，语气活泼，吸引互动。",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5-8 个相关的中文标签 (Hashtags)。",
    }
  },
  required: ["title", "mood", "diary_blocks", "social_caption", "hashtags"]
};

export const analyzeVideoFrames = async (frames: ProcessedFrame[]): Promise<GeneratedContent> => {
  try {
    // Convert frames to parts
    const parts = frames.map(frame => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: frame.dataUrl.split(',')[1] // Remove 'data:image/jpeg;base64,' prefix
      }
    }));

    // Add the text prompt
    const prompt = `
      你是一位拥有百万粉丝的生活方式博主 (Vlogger) 和视觉叙事专家。
      我从一段视频中按时间顺序截取了一系列图片（帧）。
      
      你的任务是：
      1. 仔细“观看”这些图片，理解视频的叙事线、氛围和关键动作。
      2. 生成一篇【视觉日记】(Visual Diary)：将视频拆解为几个精彩的图文段落。对于每个段落，必须从我提供的图片中选出最匹配的一张（返回其索引 index）。
      3. 生成一篇【种草文案】：适合发在小红书或 Instagram，语气要真实、活泼，多用 Emoji，排版精美。
      4. 所有输出必须使用【简体中文】。
      
      请确保 frame_index 是准确的，不要越界。图片索引从 0 开始。
    `;

    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          { text: prompt },
          ...parts
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    } else {
      throw new Error("No text response received from Gemini.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
