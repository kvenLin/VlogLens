import { ProcessedFrame } from '../types';

/**
 * Extracts frames from a video file at regular intervals.
 * This allows us to send visual data to Gemini without uploading the massive video file directly.
 */
export const extractFramesFromVideo = async (
  file: File,
  numFrames: number = 10,
  onProgress: (percent: number) => void
): Promise<ProcessedFrame[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames: ProcessedFrame[] = [];
    const url = URL.createObjectURL(file);

    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    if (!ctx) {
      reject(new Error("Could not create canvas context"));
      return;
    }

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      // Calculate timestamps to extract (evenly spaced)
      const interval = duration / (numFrames + 1);
      const timestamps = Array.from({ length: numFrames }, (_, i) => (i + 1) * interval);

      canvas.width = video.videoWidth / 2; // Resize to reduce payload size (optional optimization)
      canvas.height = video.videoHeight / 2;

      for (let i = 0; i < timestamps.length; i++) {
        const time = timestamps[i];
        
        // Update progress
        onProgress(Math.round(((i) / timestamps.length) * 100));

        // Seek
        video.currentTime = time;
        
        // Wait for seek to complete
        await new Promise<void>((r) => {
            const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                r();
            };
            video.addEventListener('seeked', onSeeked);
        });

        // Draw
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        // efficient quality setting for AI analysis
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6); 
        
        frames.push({
          timestamp: time,
          dataUrl
        });
      }

      onProgress(100);
      URL.revokeObjectURL(url);
      resolve(frames);
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error("Error loading video"));
    };
  });
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};
