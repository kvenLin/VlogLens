export interface ProcessedFrame {
  timestamp: number;
  dataUrl: string; // Base64 image
}

export interface DiaryBlock {
  time_label: string; // e.g. "09:41" or "Morning Coffee"
  text: string; // The story segment
  emoji: string;
  frame_index: number; // Index of the frame that best matches this paragraph
}

export interface GeneratedContent {
  title: string;
  mood: string;
  diary_blocks: DiaryBlock[];
  social_caption: string; // XiaoHongShu style caption
  hashtags: string[];
}

export enum AppState {
  IDLE,
  PROCESSING_VIDEO, // Extracting frames
  GENERATING_AI,    // Calling Gemini
  COMPLETE,
  ERROR
}

export interface VideoMetadata {
  duration: number;
  filename: string;
  size: number;
}
