import React, { useState } from 'react';
import { useGame } from './GameState';
import { quests } from './quests';
import { Shield, Coins, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export const DecodingShield = ({ quest, stepId, label }) => {
  const { questProgress, unlockStep, useCard } = useGame();
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const stepData = quest.steps[stepId];
  const isSolved = questProgress[stepId];

  const handleSelect = (index) => {
    if (isSolved) return;
    
    setSelectedOption(index);
    if (index === stepData.correct) {
      unlockStep(stepId);
      setErrorMsg('');
    } else {
      setErrorMsg('Not quite right. Try again, or use a Power-Card for a hint!');
    }
  };

  const handleUseHint = () => {
    if (isSolved || showHint) return;
    
    if (useCard()) {
      setShowHint(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Not enough Power-Cards!');
    }
  };

  return (
    <div className={`glass-panel animate-pop`} style={{ 
      padding: '20px', 
      marginBottom: '16px',
      border: isSolved ? '2px solid var(--success)' : '1px solid var(--card-border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isSolved ? 'var(--success)' : 'var(--text-main)' }}>
          <Shield size={24} /> {label}
        </h2>
        {isSolved && <span className="floating" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>+1 Math-Coin! 🪙</span>}
      </div>
      
      <p style={{ fontWeight: '600', fontSize: '1.2rem', margin: '12px 0' }}>{stepData.question}</p>

      {/* Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        {stepData.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = isSolved && index === stepData.correct;
          const isWrong = isSelected && !isCorrect && !isSolved;

          let bg = 'rgba(255,255,255,0.05)';
          if (isCorrect) bg = 'rgba(16, 185, 129, 0.4)'; // success
          else if (isWrong) bg = 'rgba(239, 68, 68, 0.4)'; // danger
          else if (isSelected) bg = 'var(--primary)';

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={isSolved}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--card-border)',
                background: bg,
                color: '#fff',
                cursor: isSolved ? 'default' : 'pointer',
                textAlign: 'left',
                fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.2s'
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {errorMsg && !isSolved && <p style={{ color: 'var(--danger)', marginTop: '12px' }}>{errorMsg}</p>}

      {!isSolved && (
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            className="glass-button" 
            onClick={handleUseHint}
            style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={16} /> Use Power-Card for Hint
          </button>
          
          {showHint && <div style={{ color: '#38bdf8', fontStyle: 'italic', maxWidth: '60%' }}>Hint: {stepData.hint}</div>}
        </div>
      )}

      {isSolved && (
        <div style={{ marginTop: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={20} /> Excellent! You've decoded this step!
        </div>
      )}
    </div>
  );
};

export const QuestRoom = () => {
  const { currentLevel, questProgress, finishQuest, setCurrentView } = useGame();
  
  const quest = quests.find(q => q.id === currentLevel);
  if (!quest) return null;

  const stepsSolved = Object.values(questProgress).filter(Boolean).length;
  const allSolved = stepsSolved === Object.keys(questProgress).length;

  return (
    <div className="quest-room screen animate-pop">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="title-glow" style={{ marginBottom: '8px' }}>Level {quest.id}: {quest.title}</h1>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>📍 {quest.location}</p>
        </div>
        <button className="glass-button" onClick={() => setCurrentView('map')}>Back to Map</button>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Story Panel */}
        <div style={{ flex: '1' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2>The Challenge</h2>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>{quest.story}</p>
            
            <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Quest Progress</h3>
              <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                <div style={{ 
                  width: `${(stepsSolved / 4) * 100}%`, 
                  height: '100%', 
                  background: 'var(--success)', 
                  borderRadius: '6px',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </div>
              <p style={{ textAlign: 'right', marginTop: '8px', fontSize: '0.9rem' }}>{stepsSolved} / 4 Decoded</p>
            </div>
            
            {allSolved && (
              <div className="animate-pop" style={{ marginTop: '32px', textAlign: 'center' }}>
                <button 
                  className="glass-button" 
                  onClick={finishQuest}
                  style={{ background: 'var(--success)', fontSize: '1.2rem', padding: '16px 32px' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     Complete Quest! <ArrowRight />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Decoding Shields Panel */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <DecodingShield quest={quest} stepId="asked" label="1. What is Asked?" />
          <DecodingShield quest={quest} stepId="given" label="2. What are the Given Facts?" />
          <DecodingShield quest={quest} stepId="operation" label="3. What is the Operation?" />
          <DecodingShield quest={quest} stepId="sentence" label="4. Number Sentence" />
        </div>
      </div>
    </div>
  );
};
