import React, { useEffect, useRef } from 'react';
import { useGame } from './GameState';

export const AudioEngine = () => {
  const { isMuted, currentView } = useGame();
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element once
    audioRef.current = new Audio('/music/adventure_bgm.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0; // Start at 0 for fade-in

    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.pause();
    } else {
      // Browsers block autoplay. We only play if the user is not on the home screen (meaning they've interacted)
      if (currentView !== 'home') {
        const attemptPlay = () => {
          if (!audioRef.current || isMuted) return;
          
          audioRef.current.play()
            .then(() => {
              // Fade in
              let vol = 0;
              const interval = setInterval(() => {
                vol += 0.05;
                if (vol >= 0.4) {
                  if (audioRef.current) audioRef.current.volume = 0.4;
                  clearInterval(interval);
                } else {
                  if (audioRef.current) audioRef.current.volume = vol;
                }
              }, 100);
              document.removeEventListener('click', attemptPlay);
            })
            .catch(() => {
              console.log("Audio waiting for first interaction...");
              document.addEventListener('click', attemptPlay);
            });
        };

        attemptPlay();
      }
    }
  }, [isMuted, currentView]);

  return null; // Logic only component
};
