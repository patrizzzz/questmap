import React, { createContext, useContext, useState, useEffect } from 'react';

const GameStateContext = createContext();

export const useGame = () => useContext(GameStateContext);

export const GameProvider = ({ children }) => {
  const [allQuests, setAllQuests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [cards, setCards] = useState(2);
  const [currentLevelId, setCurrentLevelId] = useState('addition_001');
  const [unlockedLevels, setUnlockedLevels] = useState(['addition_001']);
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(true);
  
  const [questProgress, setQuestProgress] = useState({
    step_1_asked: false,
    step_2_given: false,
    step_3_operation: false,
    step_4_number_sentence: false,
    final_answer: false
  });

  useEffect(() => {
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        setAllQuests(data.quests);
        setLoading(false);
      });
  }, []);

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
    setCurrentView('quest');
  };

  const finishQuest = () => {
    const quest = allQuests.find(q => q.quest_id === currentLevelId);
    if (quest && quest.reward.next_quest) {
      const nextId = quest.reward.next_quest;
      if (!unlockedLevels.includes(nextId)) {
        setUnlockedLevels(prev => [...prev, nextId]);
      }
      setCurrentLevelId(nextId); // Move the active focus to the next quest
      setCards(prev => prev + 1);
    }
    setCurrentView('map');
  };

  const contextValue = {
    allQuests, loading, coins, cards, currentLevelId, unlockedLevels, currentView, questProgress,
    earnCoin, useCard, unlockStep, startQuest, finishQuest, setCurrentView, setCurrentLevelId
  };

  return (
    <GameStateContext.Provider value={contextValue}>
      {!loading && children}
    </GameStateContext.Provider>
  );
};
