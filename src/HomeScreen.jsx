import React, { useState } from 'react';
import { useGame } from './GameState';
import { Play, Calculator, Map as MapIcon, GraduationCap, HelpCircle, Save, Users } from 'lucide-react';
import { InstructionsModal } from './InstructionsModal';
import { ProfilesModal } from './ProfilesModal';

export const HomeScreen = () => {
  const { setCurrentView, playerName, startNewGame, getAllSavedUsers, loadUserProgress, deleteUserSave } = useGame();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [localName, setLocalName] = useState(playerName);

  const savedUsers = getAllSavedUsers();
  const hasMultipleSaves = savedUsers.length > 0;

  const handleNewGame = () => {
    if (localName.trim() === '') {
      alert("Please enter your name, Explorer!");
      return;
    }
    const existing = savedUsers.find(u => u.name.toLowerCase() === localName.toLowerCase());
    if (existing && !window.confirm(`An adventurer named "${existing.name}" already exists! Overwrite their progress?`)) {
      return;
    }
    startNewGame(localName);
  };



  const handleSelectProfile = (name) => {
    loadUserProgress(name);
    setShowProfiles(false);
    setCurrentView('map');
  };

  return (
    <div className="home-screen-container">
      {/* Decorative floating icons */}
      <div className="floating-math floating-1" style={{ top: '15%', left: '15%', fontSize: '4rem' }}><Calculator size={60} /></div>
      <div className="floating-math floating-2" style={{ top: '25%', right: '15%', fontSize: '4rem' }}><GraduationCap size={70} /></div>
      <div className="floating-math floating-3" style={{ bottom: '25%', left: '20%', fontSize: '8rem' }}>π</div>
      <div className="floating-math floating-4" style={{ bottom: '20%', right: '20%', fontSize: '7rem' }}>Σ</div>

      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      {showProfiles && (
        <ProfilesModal 
          users={savedUsers} 
          onSelect={handleSelectProfile} 
          onDelete={deleteUserSave} 
          onClose={() => setShowProfiles(false)} 
        />
      )}

      <div className="home-card animate-pop">
        <div className="home-logo-section">
          <div className="home-badge">BISLIG EDITION</div>
          <h1 className="home-title text-3d" style={{ fontSize: '4.2rem', margin: '0' }}>Math-Laro</h1>
          <p className="home-tagline">Exploring Mathematics in Bislig, Leyte</p>
        </div>

        <div className="name-entry-section" style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label style={{ color: 'var(--wood)', fontWeight: '800', fontSize: '0.9rem', marginLeft: '5px' }}>ENTER EXPLORER NAME:</label>
          <input 
            type="text" 
            className="game-input"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Explorer Name..."
            maxLength={15}
          />
        </div>

        <div className="home-action-section" style={{ display: 'grid', gridTemplateColumns: hasMultipleSaves ? '1fr 1fr' : '1fr', gap: '15px' }}>
          <button 
            className="btn-premium" 
            onClick={handleNewGame}
            style={{ width: '100%', padding: '18px', fontSize: '1.4rem' }}
          >
             <Play fill="var(--wood)" color="var(--wood)" size={24} />
             <span>NEW GAME</span>
          </button>

          {hasMultipleSaves && (
            <button 
              className="btn-premium" 
              onClick={() => setShowProfiles(true)}
              style={{ width: '100%', padding: '18px', fontSize: '1.4rem', background: 'linear-gradient(to bottom, #60a5fa, #2563eb)', borderColor: 'var(--wood)' }}
            >
               <Users fill="var(--wood)" color="var(--wood)" size={24} />
               <span>LOAD GAME</span>
            </button>
          )}
        </div>

        <button 
          className="btn-game" 
          onClick={() => setShowInstructions(true)}
          style={{ width: '100%', marginTop: '15px', padding: '12px', background: 'var(--wood-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <HelpCircle size={20} /> HOW TO PLAY
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

      <div className="version-tag">Version 2.6.0 • Built with ❤️ for Bislig Students</div>
    </div>
  );
};
