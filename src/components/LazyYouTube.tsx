import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { Play } from 'lucide-react';

interface LazyYouTubeProps {
  videoId: string;
  title?: string;
}

export const LazyYouTube = ({ videoId, title }: LazyYouTubeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    return (
      <div 
        className="relative w-full h-full cursor-pointer group overflow-hidden"
        onClick={() => setIsLoaded(true)}
      >
        <img 
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
          alt={title || "Video thumbnail"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
          <div className="w-20 h-20 rounded-full bg-accent-gold-primary flex items-center justify-center shadow-gold transform transition-transform group-hover:scale-110">
            <Play className="w-8 h-8 text-bg-midnight fill-current" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <YouTube 
      videoId={videoId} 
      opts={{
        width: '100%',
        height: '100%',
        playerVars: { autoplay: 1, modestbranding: 1, rel: 0 },
      }}
      className="w-full h-full"
    />
  );
};
