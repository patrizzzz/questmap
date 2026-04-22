import React, { createContext, useContext, useState, useEffect } from 'react';

const GameStateContext = createContext();

export const useGame = () => useContext(GameStateContext);

const INDEX_KEY = 'math_laro_v2_index';
const SAVE_PREFIX = 'math_laro_v2_save_';

export const GameProvider = ({ children }) => {
  const [allQuests, setAllQuests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [cards, setCards] = useState(2);
  const [playerName, setPlayerName] = useState('Explorer');
  const [currentLevelId, setCurrentLevelId] = useState('addition_001');
  const [unlockedLevels, setUnlockedLevels] = useState(['addition_001']);
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isQuestSuccess, setIsQuestSuccess] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
  
  const [questProgress, setQuestProgress] = useState({
    step_1_asked: false, step_2_given: false, step_3_operation: false, step_4_number_sentence: false, final_answer: false
  });

  // INITIAL LOAD
  useEffect(() => {
    fetch('/questions.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load questions');
        return res.json();
      })
      .then(data => {
        setAllQuests(data.quests);
        
        // Try to load the last active user if any
        const lastUser = localStorage.getItem('math_laro_last_user');
        if (lastUser) {
          loadUserProgress(lastUser);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // AUTO-SAVE logic
  useEffect(() => {
    if (!loading && playerName !== 'Explorer') {
      saveToLocal();
      localStorage.setItem('math_laro_last_user', playerName);
    }
  }, [coins, cards, playerName, unlockedLevels, currentLevelId, loading, hasCompletedTutorial]);

  const earnCoin = (amount = 1) => {
    setCoins(prev => prev + amount);
  };

  const useCard = () => {
    if (cards > 0) {
      setCards(prev => prev - 1);
      return true;
    }
    return false;
  };

  const buyCard = (cost = 10) => {
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      setCards(prev => prev + 1);
      playSfx('success');
      return true;
    }
    playSfx('error');
    return false;
  };

  const unlockStep = (stepId, coinAmount = 1) => {
    if (!questProgress[stepId]) {
      setQuestProgress(prev => ({ ...prev, [stepId]: true }));
      earnCoin(coinAmount);
    }
  };

  const startQuest = (levelId) => {
    setCurrentLevelId(levelId);
    setQuestProgress({
      step_1_asked: false, step_2_given: false, step_3_operation: false, step_4_number_sentence: false, final_answer: false
    });
    setIsQuestSuccess(false);
    setCurrentView('quest');
  };

  const startNewGame = (newName) => {
    setCoins(0);
    setCards(2);
    setPlayerName(newName || 'Explorer');
    setUnlockedLevels(['addition_001']);
    setCurrentLevelId('addition_001');
    setHasCompletedTutorial(false);
    setQuestProgress({
      step_1_asked: false, step_2_given: false, step_3_operation: false, step_4_number_sentence: false, final_answer: false
    });
    setIsQuestSuccess(false);
    setCurrentView('map');
    
    // Explicitly update index
    const index = getAllSavedUsers();
    if (newName && !index.some(u => u.name === newName)) {
      const newIndex = [...index, { name: newName, quests: 1, coins: 0 }];
      localStorage.setItem(INDEX_KEY, JSON.stringify(newIndex));
    }
  };

  const finishQuest = () => {
    const quest = allQuests.find(q => q.quest_id === currentLevelId);
    if (quest && quest.reward.next_quest) {
      const nextId = quest.reward.next_quest;
      if (!unlockedLevels.includes(nextId)) {
        setUnlockedLevels(prev => [...prev, nextId]);
      }
      setIsQuestSuccess(true);
      setCards(prev => prev + 1);
    } else {
      setIsQuestSuccess(true);
    }
  };

  const getAllSavedUsers = () => {
    const index = localStorage.getItem(INDEX_KEY);
    return index ? JSON.parse(index) : [];
  };

  const saveToLocal = (name = playerName) => {
    if (name === 'Explorer') return false;
    
    const saveData = { 
        coins, cards, playerName: name, unlockedLevels, 
        currentLevelId, hasCompletedTutorial 
    };
    localStorage.setItem(SAVE_PREFIX + name, JSON.stringify(saveData));
    
    // Update Index with latest metadata
    const index = getAllSavedUsers();
    const existingIdx = index.findIndex(u => u.name === name);
    const meta = { name, quests: unlockedLevels.length, coins: coins };
    
    if (existingIdx >= 0) {
      index[existingIdx] = meta;
    } else {
      index.push(meta);
    }
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    return true;
  };

  const loadUserProgress = (name) => {
    const saved = localStorage.getItem(SAVE_PREFIX + name);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.coins !== undefined) setCoins(parsed.coins);
        if (parsed.cards !== undefined) setCards(parsed.cards);
        if (parsed.playerName) setPlayerName(parsed.playerName);
        if (parsed.unlockedLevels) setUnlockedLevels(parsed.unlockedLevels);
        if (parsed.currentLevelId) setCurrentLevelId(parsed.currentLevelId);
        if (parsed.hasCompletedTutorial !== undefined) setHasCompletedTutorial(parsed.hasCompletedTutorial);
        return true;
      } catch (e) {
        console.error("Error loading user", e);
      }
    }
    return false;
  };

  const deleteUserSave = (name) => {
    localStorage.removeItem(SAVE_PREFIX + name);
    const index = getAllSavedUsers();
    const newIndex = index.filter(u => u.name !== name);
    localStorage.setItem(INDEX_KEY, JSON.stringify(newIndex));
    if (playerName === name) {
      resetGame(false);
    }
  };

  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('math_laro_v2_muted') === 'true';
  });

  const playSfx = (type = 'click') => {
    if (isMuted) return;
    const sfx = new Audio(`/music/${type}.wav`);
    sfx.volume = 0.5;
    sfx.play().catch(e => console.log("SFX blocked or missing"));
  };

  useEffect(() => {
    localStorage.setItem('math_laro_v2_muted', isMuted);
  }, [isMuted]);

  const resetGame = (reload = true) => {
    setCoins(0);
    setCards(2);
    setPlayerName('Explorer');
    setUnlockedLevels(['addition_001']);
    setHasCompletedTutorial(false);
    setCurrentView('home');
    if (reload) window.location.reload();
  };

  const contextValue = {
    allQuests, loading, coins, cards, playerName, currentLevelId, unlockedLevels, currentView, questProgress,
    isQuestSuccess, hasCompletedTutorial, isMuted, setIsMuted, setIsQuestSuccess, setHasCompletedTutorial, resetGame, setPlayerName, startNewGame,
    saveToLocal, loadUserProgress, getAllSavedUsers, deleteUserSave,
    earnCoin, useCard, buyCard, unlockStep, startQuest, finishQuest, setCurrentView, setCurrentLevelId, playSfx
  };

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
};
