import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './GameState';
import { QuestMap } from './QuestMap';
import { QuestSidebar } from './QuestSidebar';
import { Coins, Lightbulb, Users, Navigation } from 'lucide-react';
import './index.css';

import { HomeScreen } from './HomeScreen';

const GameHeader = () => {
  const { coins, cards } = useGame();

  return (
    <div className="top-hud animate-slide-down">
      <div className="logo-container">
        <div className="logo-main">Math-Laro</div>
        <div className="logo-sub">Game-based Learning</div>
      </div>

      <div className="hero-profile">
        <div className="hero-avatar-wrapper">
          <img src="/avatar.png" alt="Hero Avatar" className="hero-avatar" />
        </div>
        <div className="hero-info">
          <div className="incentive-title" style={{marginBottom: '0'}}>Hero Profile</div>
          <div className="hero-name">Leo Explorer</div>
          <div className="hero-level">Rank 3 • Bislig Guardian</div>
        </div>
      </div>

      <div className="incentive-box">
        <div className="incentive-col" style={{borderRight: '2px solid rgba(0,0,0,0.1)', paddingRight: '20px'}}>
          <div className="incentive-title">Math-Coins</div>
          <div className="incentive-value-row">
            <Coins color="var(--gold-dark)" size={32} fill="rgba(253, 224, 71, 0.4)" />
            <span>{coins}</span>
          </div>
        </div>
        
        <div className="incentive-col">
          <div className="incentive-title">Power-Cards</div>
          <div className="card-icons">
             <div style={{background: '#38bdf8'}} title="Hint Hint"><Lightbulb color="white" size={18} /></div>
             <div style={{background: '#fde047'}} title="Coin Boost"><Coins color="white" size={18} /></div>
             <div style={{background: '#c084fc'}} title="Team Power"><Users color="white" size={18} /></div>
          </div>
          <div style={{fontWeight: '700', marginTop: '4px'}}>{cards} Cards</div>
        </div>
      </div>
    </div>
  );
};

const GameEngine = () => {
  const { currentView, allQuests, currentLevelId } = useGame();
  const [bg, setBg] = useState('/bg_scene.png');

  useEffect(() => {
    if (currentView === 'home') {
       setBg('/bg_scene.png');
       return;
    }
    const quest = allQuests.find(q => q.quest_id === currentLevelId);
    if (quest) {
      if (quest.topic === 'addition') setBg('/bg_meadows.png');
      else if (quest.topic === 'subtraction') setBg('/bg_springs.png');
      else if (quest.topic === 'multiplication') setBg('/bg_mountains.png');
      else if (quest.topic === 'division') setBg('/bg_meadows.png'); // Fallback
    }
  }, [currentLevelId, allQuests, currentView]);

  return (
    <div className="full-screen-container" style={{ 
      backgroundImage: `url('${bg}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image 0.8s ease-in-out'
    }}>
      <div className="overlay-vignette" />
      
      {currentView === 'home' ? (
        <HomeScreen />
      ) : (
        <>
          <GameHeader />
          <div className="map-area">
            <QuestMap setBg={setBg} />
          </div>
          {currentView === 'quest' && (
            <div className="sidebar-area">
              <QuestSidebar />
            </div>
          )}
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameEngine />
    </GameProvider>
  );
}

export default App;
