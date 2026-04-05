import React, { createContext, useContext, useState, useEffect } from 'react';

const GameStateContext = createContext();

export const useGame = () => useContext(GameStateContext);

const STORAGE_KEY = 'math_laro_v1_save_data';

export const GameProvider = ({ children }) => {
  const [allQuests, setAllQuests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [cards, setCards] = useState(2);
  const [currentLevelId, setCurrentLevelId] = useState('addition_001');
  const [unlockedLevels, setUnlockedLevels] = useState(['addition_001']);
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isQuestSuccess, setIsQuestSuccess] = useState(false);
  
  const [questProgress, setQuestProgress] = useState({
    step_1_asked: false,
    step_2_given: false,
    step_3_operation: false,
    step_4_number_sentence: false,
    final_answer: false
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
        
        // LOAD SAVED PROGRESS
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.coins) setCoins(parsed.coins);
            if (parsed.cards) setCards(parsed.cards);
            if (parsed.unlockedLevels) setUnlockedLevels(parsed.unlockedLevels);
            if (parsed.currentLevelId) setCurrentLevelId(parsed.currentLevelId);
          } catch (e) {
            console.error("Error parsing save data", e);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // SAVE PROGRESS whenever key stats change
  useEffect(() => {
    if (!loading) {
      const saveData = { coins, cards, unlockedLevels, currentLevelId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    }
  }, [coins, cards, unlockedLevels, currentLevelId, loading]);

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

  const unlockStep = (stepId, coinAmount = 1) => {
    if (!questProgress[stepId]) {
      setQuestProgress(prev => ({ ...prev, [stepId]: true }));
      earnCoin(coinAmount);
    }
  };

  const startQuest = (levelId) => {
    setCurrentLevelId(levelId);
    setQuestProgress({
      step_1_asked: false,
      step_2_given: false,
      step_3_operation: false,
      step_4_number_sentence: false,
      final_answer: false
    });
    setIsQuestSuccess(false);
    setCurrentView('quest');
  };

  const finishQuest = () => {
    const quest = allQuests.find(q => q.quest_id === currentLevelId);
    if (quest && quest.reward.next_quest) {
      const nextId = quest.reward.next_quest;
      if (!unlockedLevels.includes(nextId)) {
        setUnlockedLevels(prev => [...prev, nextId]);
      }
      // Show success screen instead of jumping straight to map
      setIsQuestSuccess(true);
      setCards(prev => prev + 1);
    } else {
      // End game state or special case
      setIsQuestSuccess(true);
    }
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const contextValue = {
    allQuests, loading, coins, cards, currentLevelId, unlockedLevels, currentView, questProgress,
    isQuestSuccess, setIsQuestSuccess, resetGame,
    earnCoin, useCard, unlockStep, startQuest, finishQuest, setCurrentView, setCurrentLevelId
  };

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
};
