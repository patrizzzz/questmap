import React, { useState, useEffect, useRef } from 'react';
import { useGame } from './GameState';
import { Sparkles, ArrowRight, X, Check, Timer } from 'lucide-react';

const STUCK_THRESHOLD = 60; // 60 seconds

export const DecodingStep = ({ quest, stepKey, label, onSolve }) => {
  const { questProgress, unlockStep, useCard, allQuests } = useGame();
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isStuck, setIsStuck] = useState(false);
  
  const stepData = quest.decoding_shield[stepKey];
  const isAlreadySolved = questProgress[stepKey];
  const timerRef = useRef(null);

  // Generate Smart Choices if not provided in JSON
  useEffect(() => {
    if (!isAlreadySolved && !choices.length) {
      const correct = stepData.accepted_answers[0];
      
      // Get distracted candidates from other quests of same topic
      const candidates = allQuests
        .filter(q => q.topic === quest.topic && q.quest_id !== quest.quest_id)
        .map(q => q.decoding_shield[stepKey].accepted_answers[0]);
      
      // Pick 2 random distractors
      const distractors = candidates.length >= 2 
        ? candidates.sort(() => Math.random() - 0.5).slice(0, 2)
        : ["Unknown value", "Total amount"];
      
      const finalChoices = [correct, ...distractors].sort(() => Math.random() - 0.5);
      setChoices(finalChoices);
    }
  }, [allQuests, quest, stepKey, isAlreadySolved]);

  useEffect(() => {
    if (!isAlreadySolved && !isCorrect) {
      timerRef.current = setInterval(() => {
        setTimer(t => {
          if (t >= STUCK_THRESHOLD) {
             setIsStuck(true);
             return t;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isAlreadySolved, isCorrect]);

  const handleSelect = (choice) => {
    if (isAlreadySolved || isCorrect) return;
    
    setSelectedChoice(choice);
    const correctAnswers = stepData.accepted_answers.map(a => a.toLowerCase());
    
    if (correctAnswers.includes(choice.toLowerCase())) {
      setIsCorrect(true);
      unlockStep(stepKey, stepData.coins);
      clearInterval(timerRef.current);
    } else {
      setErrorCount(prev => prev + 1);
      // Wait a bit then clear the selection so they can try again
      setTimeout(() => setSelectedChoice(null), 1000);
    }
  };

  const handleUseHint = () => {
    if (useCard()) {
       setShowHint(true);
       setIsStuck(false);
       setTimer(0);
    }
  };

  const isOperation = stepKey === 'step_3_operation';

  return (
    <div className={`shield-quadrant ${selectedChoice && !isCorrect ? 'shake' : ''}`} style={{ 
      borderColor: isAlreadySolved || isCorrect ? '#22c55e' : (isStuck ? '#f59e0b' : '#60a5fa'), 
      boxShadow: isStuck ? '0 0 15px #f59e0b' : 'none',
      minHeight: '140px'
    }}>
      <div className="quad-title" style={{ fontSize: '0.9rem', width: '100%', justifyContent: 'space-between' }}>
        <span style={{display:'flex', alignItems:'center', gap:'4px'}}>{label}</span>
        {isStuck && !isAlreadySolved && <span className="floating" style={{ fontSize: '0.65rem', color: '#fbbf24' }}>GIVING UP? <Sparkles size={12} /></span>}
      </div>

      <div className="quad-content" style={{ padding: '4px', overflow: 'hidden' }}>
        {isAlreadySolved || isCorrect ? (
          <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>
            {selectedChoice || stepData.accepted_answers[0]}
          </div>
        ) : isOperation ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
             {['+', '-', 'x', '÷'].map((op, i) => {
                const opName = op === '+' ? 'addition' : op === '-' ? 'subtraction' : op === 'x' ? 'multiplication' : 'division';
                return (
                  <button key={i} className="btn-op" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }} onClick={() => handleSelect(opName)}>{op}</button>
                )
             })}
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {choices.map((choice, i) => (
              <button 
                key={i} 
                className={`quad-choice ${selectedChoice === choice ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleSelect(choice)}
                style={{ fontSize: '0.75rem', padding: '6px' }}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>

      {showHint && !isAlreadySolved && !isCorrect && <div style={{ color: '#38bdf8', fontSize: '0.7rem', marginTop: '4px', fontStyle: 'italic', textAlign: 'center' }}>{quest.hint.text}</div>}
      
      {!isAlreadySolved && !isCorrect && isStuck && (
        <button onClick={handleUseHint} style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', alignSelf: 'center' }}>
          <Sparkles size={14} /> Use Power-Card
        </button>
      )}
    </div>
  );
};

export const QuestSidebar = () => {
  const { currentLevelId, allQuests, questProgress, unlockStep, setCurrentView, finishQuest } = useGame();
  
  const quest = allQuests.find(q => q.quest_id === currentLevelId);
  if (!quest) return null;

  const steps = ['step_1_asked', 'step_2_given', 'step_3_operation', 'step_4_number_sentence'];
  const solvedCount = steps.filter(s => questProgress[s]).length;
  const allSolved = solvedCount === 4;

  return (
    <div className="panel-container">
      <div className="panel-header">
         <span>{quest.title}</span>
         <button className="btn-game btn-close" onClick={() => setCurrentView('map')}><X size={20} /></button>
      </div>

      <div className="panel-body">
        <div className="story-card">
           <div className="story-img-wrapper">
             <img src="/story_img.png" alt="Mang Juan" className="story-img" />
           </div>
           <div className="story-text-container">
             <h3 style={{ color: 'var(--wood)', fontSize: '1rem', marginBottom: '2px' }}>{quest.story.setting}</h3>
             <p style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>{quest.story.narrative}</p>
           </div>
        </div>

        <div className="shield-wrapper">
          <div className="shield-title">DECODING SHIELD</div>
          <div className="shield-grid">
            <DecodingStep quest={quest} stepKey="step_1_asked" label="🔍 What's Asked?" />
            <DecodingStep quest={quest} stepKey="step_2_given" label="🧺 What's Given?" />
            <DecodingStep quest={quest} stepKey="step_3_operation" label="🧮 Operation" />
            <DecodingStep quest={quest} stepKey="step_4_number_sentence" label="📝 Sentence" />
          </div>

          {allSolved && (
            <div className="animate-pop" style={{ marginTop: '12px', background: 'white', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
               <div style={{ fontWeight: '700', color: 'var(--wood)', marginBottom: '8px' }}>FINAL ANSWER</div>
               <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="Enter value" 
                    style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '2px solid #ccc' }} 
                    onBlur={(e) => {
                      if (e.target.value == quest.answer.value) {
                         unlockStep('final_answer', quest.answer.coins_for_correct_answer);
                      }
                    }}
                  />
                  <span>{quest.answer.unit}</span>
               </div>
               
               {questProgress.final_answer && (
                 <button className="btn-game btn-play" style={{ width: '100%', marginTop: '8px' }} onClick={finishQuest}>
                    COMPLETE QUEST <ArrowRight size={20} />
                 </button>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
