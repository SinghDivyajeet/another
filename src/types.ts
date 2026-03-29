export interface Device {
  serial: string;
  model: string;
  state: string;
}

export interface Toast {
  id: number;
  message: string;
  type: "error" | "info";
}

export interface Settings {
  max_size: number;
  max_fps: number;
  video_bit_rate: number;
  video_codec: string;
}

export type FrameEvent =
  | { event: "frame"; data: { width: number; height: number; jpeg_base64: string } }
  | { event: "disconnected"; data: { reason: string } }
  | { event: "size_changed"; data: { width: number; height: number } };

export type Screen = "welcome" | "another";

export type ThemePreference = "light" | "dark" | "auto";

export const PRESETS: Record<string, Settings> = {
  performance: { max_size: 720, max_fps: 30, video_bit_rate: 2000000, video_codec: "h264" },
  balanced: { max_size: 1024, max_fps: 60, video_bit_rate: 8000000, video_codec: "h264" },
  quality: { max_size: 1920, max_fps: 60, video_bit_rate: 24000000, video_codec: "h264" },
};

export const RESOLUTION_OPTIONS = [
  { value: 480, label: "480p" },
  { value: 720, label: "720p" },
  { value: 1024, label: "1024p" },
  { value: 1280, label: "1280p" },
  { value: 1920, label: "1920p" },
  { value: 0, label: "Native" },
];

export const CODEC_OPTIONS = [
  { value: "h264", label: "H.264" },
  { value: "h265", label: "H.265" },
];
