'use client';

import React from 'react';
import { VideoIcon } from './icons';

export interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

/**
 * Transforms standard video URLs (YouTube, Vimeo, direct MP4) into embeddable URLs
 */
export function getEmbedUrl(url: string): { type: 'iframe' | 'video' | 'invalid'; src: string } {
  if (!url || typeof url !== 'string') {
    return { type: 'invalid', src: '' };
  }

  const trimmed = url.trim();

  // YouTube standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
    };
  }

  // Vimeo URL: https://vimeo.com/123456789
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct MP4 or WebM video
  if (trimmed.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return {
      type: 'video',
      src: trimmed,
    };
  }

  // If already an embed or HTTPS URL, attempt iframe
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      type: 'iframe',
      src: trimmed,
    };
  }

  return { type: 'invalid', src: trimmed };
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  const { type, src } = getEmbedUrl(videoUrl);

  if (type === 'invalid' || !src) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 border border-slate-800">
        <VideoIcon className="w-12 h-12 text-slate-600 mb-3" />
        <h4 className="text-sm font-semibold text-slate-200 mb-1">
          Video Player Unavailable
        </h4>
        <p className="text-xs text-slate-400 text-center max-w-sm">
          The video URL for &quot;{title}&quot; is empty or in an unsupported format.
        </p>
        <span className="mt-3 font-mono text-[11px] text-slate-500 bg-slate-800 px-2 py-1 rounded">
          {videoUrl || 'No URL specified'}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {type === 'video' ? (
        <video
          controls
          playsInline
          className="w-full h-full object-contain"
          src={src}
        >
          Your browser does not support HTML5 video streaming.
        </video>
      ) : (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
};
