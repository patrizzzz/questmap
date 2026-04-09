import React, { useState, useEffect } from 'react';
import { useGame } from './GameState';
import { ChevronRight, ChevronLeft, SkipForward, Play, Map as MapIcon, Shield, Coins } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: "Welcome, Explorer!",
    content: "Welcome to Bislig! I'm here to show you how to become a Math Guardian. Are you ready to begin your adventure?",
    icon: <Play size={40} color="var(--primary)" />,
    target: "none",
    cardPos: "center"
  },
  {
    title: "The Quest Map",
    content: "This is the map of Bislig. To continue, click a golden quest icon on the map and then click the 'PLAY' button!",
    icon: <MapIcon size={40} color="var(--primary)" />,
    target: "map",
    cardPos: "bottom",
    requireAction: "play"
  },
  {
    title: "Rewards & Stats",
    content: "Great job! Before we look at the quest, see your Math-Coins and Power-Cards here. You earn these as you solve problems!",
    icon: <Coins size={40} color="var(--gold-dark)" />,
    target: "hud",
    cardPos: "center"
  },
  {
    title: "The Decoding Shield",
    content: "This is your most powerful tool! Use it to solve word problems step-by-step. Follow the 4-step logic to earn maximum coins!",
    icon: <Shield size={40} color="var(--primary)" />,
    target: "sidebar",
    cardPos: "left"
  },
  {
    title: "Good Luck!",
    content: "You're all set, Guardian! Clear every quest to protect Bislig. Let the adventure begin!",
    icon: <div style={{ fontSize: '3rem' }}>🌟</div>,
    target: "none",
    cardPos: "center"
  }
];

export const OnboardingTutorial = () => {
  const { setHasCompletedTutorial, currentView } = useGame();
  const [currentStep, setCurrentStep] = useState(0);

  const step = TUTORIAL_STEPS[currentStep];

  // Auto-advance if we were waiting for 'play' and the view changed to quest
  useEffect(() => {
    if (step.requireAction === 'play' && currentView === 'quest') {
      setTimeout(() => {
        handleNext();
      }, 500); // Small delay to let the sidebar animate in
    }
  }, [currentView, currentStep]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setHasCompletedTutorial(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-background" />
      
      {step.target !== 'none' && (
        <div className={`tutorial-arrow arrow-${step.target}`} />
      )}
      
      <div className={`tutorial-card animate-pop pos-${step.cardPos}`}>
        <div className="tutorial-icon-wrapper">
          {step.icon}
        </div>
        
        <h2 className="tutorial-title">{step.title}</h2>
        <p className="tutorial-content">{step.content}</p>
        
        <div className="tutorial-footer">
          <button className="btn-skip" onClick={() => setHasCompletedTutorial(true)}>
            <SkipForward size={16} /> Skip
          </button>
          
          <div className="tutorial-nav">
            {currentStep > 0 && !step.requireAction && (
              <button className="btn-nav" onClick={handleBack}>
                <ChevronLeft size={20} />
              </button>
            )}
            
            <div className="step-dots">
              {TUTORIAL_STEPS.map((_, i) => (
                <div key={i} className={`step-dot ${i === currentStep ? 'active' : ''}`} />
              ))}
            </div>
            
            {!step.requireAction && (
              <button className="btn-premium btn-next" onClick={handleNext}>
                {currentStep === TUTORIAL_STEPS.length - 1 ? "FINISH" : <ChevronRight size={20} />}
              </button>
            )}

            {step.requireAction && (
               <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', animation: 'pulse 2s infinite' }}>
                 REQUIRED ACTION: PLAY A QUEST
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
