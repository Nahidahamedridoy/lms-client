'use client';

import React from 'react';
import { VideoIcon } from './icons';

export interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

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

  // Generic HTTP/HTTPS URL iframe attempt
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
      <div className="w-full aspect-video bg-[#14213D] rounded-3xl flex flex-col items-center justify-center p-8 text-slate-400 border border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-amber-400">
          <VideoIcon className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">
          Video Player Unavailable
        </h4>
        <p className="text-xs text-slate-400 text-center max-w-sm leading-relaxed">
          The video stream for &quot;{title}&quot; is currently unavailable or invalid.
        </p>
        <span className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          {videoUrl || 'No video URL specified'}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 ring-1 ring-white/10">
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
