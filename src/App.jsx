import React, { useState, useEffect } from 'react';
import { useGame, GameProvider } from './GameState';
import { QuestMap } from './QuestMap';
import { QuestSidebar } from './QuestSidebar';
import { Coins, Lightbulb, Play, ArrowRight, Timer, X, Save, LogOut, HelpCircle, RotateCcw, Volume2, VolumeX, ShoppingBag, Sparkles, Trophy } from 'lucide-react';
import './index.css';

import { HomeScreen } from './HomeScreen';
import { InstructionsModal } from './InstructionsModal';
import { OnboardingTutorial } from './OnboardingTutorial';
import { AudioEngine } from './AudioEngine';
import { StatsModal } from './StatsModal';

const MenuOverlay = ({ onClose, onOpenStats }) => {
  const { setCurrentView, saveToLocal, loadFromLocal, resetGame } = useGame();
  const [saveStatus, setSaveStatus] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSave = () => {
    saveToLocal();
    setSaveStatus('GAME SAVED!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleLoad = () => {
    if (window.confirm("Load your last save? This will undo any unsaved progress!")) {
      if (loadFromLocal()) {
        setSaveStatus('LOADED!');
        setTimeout(() => {
          setSaveStatus('');
          onClose();
        }, 1000);
      }
    }
  };

  if (showInstructions) {
    return <InstructionsModal onClose={() => setShowInstructions(false)} />;
  }

  return (
    <div className="success-overlay" style={{ zIndex: 5000 }}>
      <div className="success-card animate-pop" style={{ width: '380px', padding: '30px' }}>
        <h2 className="success-title" style={{ fontSize: '2.5rem', marginBottom: '25px' }}>GAME MENU</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="btn-premium" onClick={onClose} style={{ padding: '15px' }}>
            <Play fill="currentColor" size={20} /> RESUME
          </button>

          <button className="btn-premium" onClick={handleSave} style={{ padding: '15px', background: 'linear-gradient(to bottom, #4ade80, #16a34a)' }}>
            <Save fill="currentColor" size={20} /> {saveStatus || 'SAVE GAME'}
          </button>

          <button className="btn-premium" onClick={handleLoad} style={{ padding: '15px', background: 'linear-gradient(to bottom, #60a5fa, #2563eb)' }}>
            <RotateCcw size={20} /> LOAD LAST SAVE
          </button>

          <button className="btn-premium" onClick={onOpenStats} style={{ padding: '15px', background: 'linear-gradient(to bottom, #a855f7, #7c3aed)' }}>
            <Trophy fill="currentColor" size={20} /> STATS & HISTORY
          </button>

          <button className="btn-premium" onClick={() => setShowInstructions(true)} style={{ padding: '15px', background: 'linear-gradient(to bottom, var(--wood-light), var(--wood))', color: 'white' }}>
            <HelpCircle size={20} /> HOW TO PLAY
          </button>

          <div style={{ height: '2px', background: 'rgba(0,0,0,0.1)', margin: '10px 0' }} />

          <button 
            className="btn-game" 
            onClick={() => setCurrentView('home')} 
            style={{ padding: '15px', background: 'var(--danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <LogOut size={20} /> QUIT TO HOME
          </button>
        </div>

        <button 
           onClick={() => { if(window.confirm("Reset all game data? This cannot be undone!")) resetGame(); }}
           style={{ marginTop: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
          RESET ENTIRE PROGRESS
        </button>
      </div>
    </div>
  );
};

const SuccessOverlay = () => {
  const { currentLevelId, allQuests, setIsQuestSuccess, setCurrentView } = useGame();
  const quest = allQuests.find(q => q.quest_id === currentLevelId);
  
  if (!quest) return null;

  return (
    <div className="success-overlay">
      <div className="success-card animate-pop">
        <div style={{ fontSize: '5rem', marginBottom: '10px' }}>🌟</div>
        <h1 className="success-title">QUEST CLEAR!</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--wood)', fontWeight: '600' }}>
          You've successfully solved: <br/>
          <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>{quest.title}</span>
        </p>

        <div className="reward-row">
          <div className="reward-item">
            <div className="reward-icon"><Coins color="var(--gold-dark)" size={40} /></div>
            <div style={{ color: 'var(--gold-dark)', fontWeight: 'bold' }}>MATH-COINS</div>
            <div className="reward-value">+{quest.answer.coins_for_correct_answer}</div>
          </div>
          <div className="reward-item">
            <div className="reward-icon" style={{ background: '#fef9c3' }}><Lightbulb color="#ca8a04" size={40} /></div>
            <div style={{ color: '#ca8a04', fontWeight: 'bold' }}>POWER-CARD</div>
            <div className="reward-value">+1</div>
          </div>
        </div>

        <button 
          className="btn-premium" 
          style={{ width: '100%', padding: '20px', fontSize: '1.5rem', marginTop: '10px' }}
          onClick={() => {
            setIsQuestSuccess(false);
            setCurrentView('map');
          }}
        >
          CONTINUE TO MAP
        </button>
      </div>
    </div>
  );
};

const MarketModal = ({ onClose }) => {
  const { coins, cards, buyCard } = useGame();
  const CARD_COST = 10;

  const handleBuy = () => {
    if (!buyCard(CARD_COST)) {
      alert("Not enough Math-Coins! Complete more quests to earn more.");
    }
  };

  return (
    <div className="success-overlay" style={{ zIndex: 6000 }}>
      <div className="success-card animate-pop" style={{ width: '420px', padding: '30px', background: 'var(--bg-parchment-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
           <h2 className="success-title" style={{ fontSize: '2.5rem', margin: 0 }}>MARKET</h2>
           <button onClick={onClose} style={{ background: 'var(--danger)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
             <X size={20} color="white" />
           </button>
        </div>

        <div className="story-card" style={{ background: 'white', padding: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: 'var(--wood)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px' }}>YOUR BALANCE:</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins color="var(--gold-dark)" size={24} />
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--wood)' }}>{coins}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'var(--primary)', padding: '4px', borderRadius: '8px' }}>
                  <Lightbulb color="white" size={18} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--wood)' }}>{cards}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="item-card" style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '3px solid var(--wood)', boxShadow: '0 8px 0 var(--wood-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)' }}>
              <Lightbulb color="white" size={48} className="floating" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ color: 'var(--wood)', fontSize: '1.2rem', fontWeight: '800' }}>POWER CARD</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Reveals a hint during decoding steps.</p>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Coins color="var(--gold-dark)" size={20} />
              <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--gold-dark)' }}>{CARD_COST}</span>
            </div>
            <button 
              className="btn-premium" 
              onClick={handleBuy}
              style={{ padding: '10px 25px', fontSize: '1rem' }}
              disabled={coins < CARD_COST}
            >
              EXCHANGE
            </button>
          </div>
        </div>

        <p style={{ marginTop: '25px', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
          "Power Cards are essential for unlocking tricky Decoding Shields!"
        </p>
      </div>
    </div>
  );
};

const GameHeader = ({ onOpenMenu, onOpenMarket, onOpenStats }) => {
  const { coins, cards, resetGame, playerName, setCurrentView, isMuted, setIsMuted } = useGame();

  return (
    <div className="top-hud animate-slide-down">
      <div className="logo-container animate-pop">
        <div className="logo-main text-3d" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>Math-Laro</div>
        <div className="logo-sub">Bislig • Grade 3 Math</div>
      </div>

      <div className="hero-profile glass-widget">
        <div className="hero-avatar-wrapper">
          <img src="/avatar.png" alt="Hero Avatar" className="hero-avatar" />
        </div>
        <div className="hero-info">
          <div className="hero-name" onClick={() => { if(window.confirm("Reset game?")) resetGame(); }}>{playerName}</div>
          <div className="hero-level">Bislig Guardian • Rank 3</div>
        </div>
      </div>

      <div className="hud-actions" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        <button 
          className="btn-game" 
          onClick={() => setIsMuted(!isMuted)}
          style={{ padding: '12px', background: 'var(--wood)', color: 'var(--gold)', border: '2px solid var(--gold)', borderRadius: '12px' }}
          title={isMuted ? "Unmute Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="incentive-box glass-widget">
          <div className="incentive-col">
            <div className="incentive-title">Math-Coins</div>
            <div className="incentive-value-row">
              <Coins color="var(--gold-dark)" size={24} fill="rgba(253, 224, 71, 0.4)" />
              <span>{coins}</span>
            </div>
          </div>
          
          <div className="incentive-col">
            <div className="incentive-title">Power-Cards</div>
            <div className="incentive-value-row">
               <div style={{ background: 'var(--primary)', padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Lightbulb color="white" size={20} />
               </div>
               <span>{cards}</span>
            </div>
          </div>
        </div>

        <button 
          className="btn-game" 
          onClick={onOpenStats}
          style={{ padding: '12px', background: 'linear-gradient(to bottom, #a855f7, #7c3aed)', color: 'white', border: '2px solid white', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          title="Stats & Achievements"
        >
          <Trophy size={20} /> STATS
        </button>

        <button 
          className="btn-game" 
          onClick={onOpenMarket}
          style={{ padding: '12px', background: 'var(--primary)', color: 'white', border: '2px solid white', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          title="Market"
        >
          <ShoppingBag size={20} /> MARKET
        </button>

        <button 
          className="btn-game" 
          onClick={onOpenMenu}
          style={{ padding: '12px', background: 'var(--wood)', color: 'var(--gold)', border: '2px solid var(--gold)', borderRadius: '12px' }}
          title="Game Menu"
        >
          <X size={20} /> MENU
        </button>
      </div>
    </div>
  );
};

const GameEngine = () => {
  const { currentView, allQuests, currentLevelId, isQuestSuccess, loading, hasCompletedTutorial, playSfx } = useGame();
  const [bg, setBg] = useState('/bg_scene.png');
  const [showMenu, setShowMenu] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Global UI Click Sound Handler
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target;
      // Play sound if we clicked a button or something with a primary game class
      if (
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.classList.contains('map-node') ||
        target.classList.contains('option-btn')
      ) {
        playSfx('click');
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, [playSfx]);

  useEffect(() => {
    const activeQuest = allQuests.find(q => q.quest_id === currentLevelId);
    if (activeQuest) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (activeQuest.topic === 'addition') setBg('/bg_meadows.png');
      else if (activeQuest.topic === 'subtraction') setBg('/bg_springs.png');
      else if (activeQuest.topic === 'multiplication') setBg('/bg_mountains.png');
      else if (activeQuest.topic === 'division') setBg('/bg_meadows.png');
    }
  }, [currentLevelId, allQuests]);

  // If loading and no quests yet, show a themed loading state to avoid black screen
  if (loading && allQuests.length === 0) {
    return (
      <div className="full-screen-container" style={{ background: 'var(--bg-parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--wood)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 2s infinite ease-in-out' }}>🗺️</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>LOADING MAP...</h2>
          <p>Preparing your Bislig Adventure</p>
        </div>
      </div>
    );
  }

  return (
    <div className="full-screen-container" style={{ background: `url(${bg}) center center / cover no-repeat, var(--bg-parchment)` }}>
      <div className="overlay-vignette" />
      
      {currentView === 'home' ? (
        <HomeScreen />
      ) : (
        <>
          {isQuestSuccess && <SuccessOverlay />}
          {!hasCompletedTutorial && <OnboardingTutorial />}
          {showMenu && <MenuOverlay onClose={() => setShowMenu(false)} onOpenStats={() => { setShowMenu(false); setShowStats(true); }} />}
          {showMarket && <MarketModal onClose={() => setShowMarket(false)} />}
          {showStats && <StatsModal onClose={() => setShowStats(false)} />}
          <GameHeader onOpenMenu={() => setShowMenu(true)} onOpenMarket={() => setShowMarket(true)} onOpenStats={() => setShowStats(true)} />
          <div className="map-area">
            <QuestMap setBg={setBg} />
          </div>
          {currentView === 'quest' && (
            <div className="sidebar-area animate-pop">
              <QuestSidebar />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
       <AudioEngine />
       <GameEngine />
    </GameProvider>
  );
}
