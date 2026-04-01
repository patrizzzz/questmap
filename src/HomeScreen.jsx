import React from 'react';
import { useGame } from './GameState';
import { Play, Calculator, Map as MapIcon, GraduationCap } from 'lucide-react';

export const HomeScreen = () => {
  const { setCurrentView } = useGame();

  return (
    <div className="home-screen-container">
      {/* Decorative floating icons */}
      <div className="floating-ornament math-1"><Calculator size={40} /></div>
      <div className="floating-ornament math-2"><GraduationCap size={44} /></div>
      <div className="floating-ornament math-3">π</div>
      <div className="floating-ornament math-4">Σ</div>

      <div className="home-card animate-pop">
        <div className="home-logo-section">
          <div className="home-badge">BISLIG EDITION</div>
          <h1 className="home-title">Math-Laro</h1>
          <p className="home-tagline">Exploring the Wonders of Mathematics in Leyte</p>
        </div>

        <div className="home-action-section">
          <button 
            className="btn-game btn-home-play" 
            onClick={() => setCurrentView('map')}
          >
             <Play fill="var(--wood)" color="var(--wood)" size={24} />
            <span>PLAY AS GUEST</span>
          </button>
          
          <div className="home-footer">
            <div className="footer-item">
              <MapIcon size={16} /> 20 Localized Quests
            </div>
            <div className="footer-item">
              <GraduationCap size={16} /> Grade 3 Curriculum
            </div>
          </div>
        </div>
      </div>

      <div className="version-tag">Version 2.4.0 • Built with ❤️ for Bislig Students</div>
    </div>
  );
};
