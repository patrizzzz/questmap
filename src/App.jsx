import React, { useState, useEffect } from 'react';
import { useGame, GameProvider } from './GameState';
import { QuestMap } from './QuestMap';
import { QuestSidebar } from './QuestSidebar';
import { Coins, Lightbulb, User, ArrowRight, Timer, X } from 'lucide-react';
import './index.css';

import { HomeScreen } from './HomeScreen';

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

const GameHeader = () => {
  const { coins, cards, resetGame } = useGame();

  return (
    <div className="top-hud animate-slide-down">
      <div className="logo-container animate-pop">
        <div className="logo-main text-3d">Math-Laro</div>
        <div className="logo-sub">Bislig • Grade 3 Math</div>
      </div>

      <div className="hero-profile glass-widget">
        <div className="hero-avatar-wrapper">
          <img src="/avatar.png" alt="Hero Avatar" className="hero-avatar" />
        </div>
        <div className="hero-info">
          <div className="hero-name" onClick={() => { if(window.confirm("Reset game?")) resetGame(); }}>Leo Explorer</div>
          <div className="hero-level">Bislig Guardian • Rank 3</div>
        </div>
      </div>

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
    </div>
  );
};

const GameEngine = () => {
  const { currentView, allQuests, currentLevelId, isQuestSuccess, loading } = useGame();
  const [bg, setBg] = useState('/bg_scene.png');

  useEffect(() => {
    const activeQuest = allQuests.find(q => q.quest_id === currentLevelId);
    if (activeQuest) {
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
          <GameHeader />
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
       <GameEngine />
    </GameProvider>
  );
}
