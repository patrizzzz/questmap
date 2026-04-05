import React from 'react';
import { useGame } from './GameState';
import { Play, Calculator, Map as MapIcon, GraduationCap } from 'lucide-react';

export const HomeScreen = () => {
  const { setCurrentView } = useGame();

  return (
    <div className="home-screen-container">
      {/* Decorative floating icons */}
      <div className="floating-math floating-1" style={{ top: '15%', left: '15%', fontSize: '4rem' }}><Calculator size={60} /></div>
      <div className="floating-math floating-2" style={{ top: '25%', right: '15%', fontSize: '4rem' }}><GraduationCap size={70} /></div>
      <div className="floating-math floating-3" style={{ bottom: '25%', left: '20%', fontSize: '8rem' }}>π</div>
      <div className="floating-math floating-4" style={{ bottom: '20%', right: '20%', fontSize: '7rem' }}>Σ</div>

      <div className="home-card animate-pop">
        <div className="home-logo-section">
          <div className="home-badge">BISLIG EDITION</div>
          <h1 className="home-title text-3d" style={{ fontSize: '4.5rem', margin: '0' }}>Math-Laro</h1>
          <p className="home-tagline">Exploring the Wonders of Mathematics in Leyte</p>
        </div>

        <div className="home-action-section">
          <button 
            className="btn-premium" 
            onClick={() => setCurrentView('map')}
            style={{ width: '100%', padding: '20px', fontSize: '1.8rem' }}
          >
             <Play fill="var(--wood)" color="var(--wood)" size={28} />
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
