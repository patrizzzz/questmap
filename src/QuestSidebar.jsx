import React, { useState, useEffect, useRef } from 'react';
import { useGame } from './GameState';
import { Sparkles, ArrowRight, X, Check, Timer } from 'lucide-react';

const STUCK_THRESHOLD = 60; // 60 seconds

export const DecodingStep = ({ quest, stepKey, label }) => {
  const { questProgress, unlockStep, useCard, allQuests, cards } = useGame();
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isStuck, setIsStuck] = useState(false);
  
  const stepData = quest.decoding_shield[stepKey];
  const isAlreadySolved = questProgress[stepKey];
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isAlreadySolved && !choices.length) {
      const correct = stepData.accepted_answers[0];
      const candidates = allQuests
        .filter(q => q.topic === quest.topic && q.quest_id !== quest.quest_id)
        .map(q => q.decoding_shield[stepKey].accepted_answers[0]);
      
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
      setTimeout(() => setSelectedChoice(null), 1000);
    }
  };

  const getStepHint = () => {
    switch(stepKey) {
      case 'step_1_asked': return "What are we trying to find out? Look for words like 'total', 'how many', or 'left'.";
      case 'step_2_given': return "Find the numbers in the story and what they represent (e.g., '45 coconuts').";
      case 'step_3_operation': return "Should we combine (+), find the difference (-), repeat (x), or share (÷)?";
      case 'step_4_number_sentence': return "Turn the words into math! Use the numbers and the operation sign, like 'A + B = n'.";
      default: return quest.hint?.text || "Look closely at the numbers!";
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
  const statusColor = isAlreadySolved || isCorrect ? 'var(--success)' : (isStuck ? 'var(--accent)' : 'var(--gold)');

  return (
    <div className={`shield-quadrant ${selectedChoice && !isCorrect ? 'shake' : ''}`} style={{ 
      borderColor: statusColor,
      background: isAlreadySolved || isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0, 0, 0, 0.2)',
      display: 'flex', flexDirection: 'column', gap: '8px'
    }}>
      <div className="quad-title" style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'space-between', color: statusColor, fontWeight: '800' }}>
        <span style={{display:'flex', alignItems:'center', gap:'4px'}}>{label}</span>
        {isAlreadySolved || isCorrect ? <Check size={14} /> : (isStuck && <Sparkles size={14} className="floating" />)}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {isAlreadySolved || isCorrect ? (
          <div style={{ color: 'white', fontWeight: '800', fontSize: '0.85rem', textAlign: 'center', background: 'var(--success)', padding: '6px 12px', borderRadius: '8px', width: '100%' }}>
            {selectedChoice || stepData.accepted_answers[0]}
          </div>
        ) : isOperation ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', width: '100%' }}>
             {['+', '-', 'x', '÷'].map((op, i) => (
                <button key={i} className="btn-game btn-op" style={{ padding: '6px', fontSize: '1rem', background: 'var(--primary)', color: 'white' }} onClick={() => handleSelect(op === '+' ? 'addition' : op === '-' ? 'subtraction' : op === 'x' ? 'multiplication' : 'division')}>{op}</button>
             ))}
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {choices.map((choice, i) => (
              <button 
                key={i} 
                className="quad-choice"
                onClick={() => handleSelect(choice)}
                style={{ fontSize: '0.7rem', padding: '6px', border: selectedChoice === choice ? '2px solid var(--danger)' : '1px solid #e2e8f0' }}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isAlreadySolved && !isCorrect && (
        <div style={{ minHeight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showHint ? (
            <div style={{ color: '#fef3c7', fontSize: '0.65rem', fontStyle: 'italic', textAlign: 'center' }}>{getStepHint()}</div>
          ) : (cards > 0 || isStuck) ? (
            <button onClick={handleUseHint} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <Sparkles size={10} /> USE HINT?
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export const QuestSidebar = () => {
  const { currentLevelId, allQuests, questProgress, unlockStep, setCurrentView, finishQuest, cards, useCard } = useGame();
  const [finalVal, setFinalVal] = useState('');
  const [showFinalHint, setShowFinalHint] = useState(false);
  
  const quest = allQuests.find(q => q.quest_id === currentLevelId);
  if (!quest) return null;

  const steps = ['step_1_asked', 'step_2_given', 'step_3_operation', 'step_4_number_sentence'];
  const solvedCount = steps.filter(s => questProgress[s]).length;
  const allStepsSolved = solvedCount === 4;

  const handleFinalSubmit = () => {
    if (finalVal.trim() == quest.answer.value) {
       unlockStep('final_answer', quest.answer.coins_for_correct_answer);
    } else {
       alert("That's not quite right. Check your calculation again!");
    }
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
         <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Timer size={18} /> {quest.title}</span>
         <button className="btn-game btn-close" onClick={() => setCurrentView('map')} style={{ background: 'var(--danger)', padding: '4px', borderRadius: '4px' }}><X size={16} color="white" /></button>
      </div>

      <div className="panel-body" style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
        <div className="story-card">
           <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
             <img src="/story_img.png" alt="Story Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <h3 style={{ color: 'var(--wood)', fontSize: '0.85rem', marginBottom: '2px' }}>📍 {quest.story.setting}</h3>
             <p style={{ fontSize: '0.75rem', lineHeight: '1.4', margin: 0, color: '#475569' }}>{quest.story.narrative}</p>
           </div>
        </div>

        <div className="shield-wrapper">
          <div className="shield-title">DECODING SHIELD</div>
          <div className="shield-grid">
            <DecodingStep quest={quest} stepKey="step_1_asked" label="1. What is Asked?" />
            <DecodingStep quest={quest} stepKey="step_2_given" label="2. What are Given?" />
            <DecodingStep quest={quest} stepKey="step_3_operation" label="3. Logic Gate" />
            <DecodingStep quest={quest} stepKey="step_4_number_sentence" label="4. Sentence" />
          </div>

          <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.7rem', fontWeight: '800', color: 'white' }}>
                <span>INTEGRITY</span>
                <span>{solvedCount}/4</span>
             </div>
             <div style={{ height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(solvedCount/4)*100}%`, height: '100%', background: 'var(--success)', transition: 'width 0.5s' }} />
             </div>
          </div>

          {allStepsSolved && (
            <div className="animate-pop" style={{ marginTop: '12px', background: 'white', padding: '12px', borderRadius: '16px', textAlign: 'center', border: '3px solid var(--wood)' }}>
               <div style={{ fontWeight: '800', color: 'var(--wood)', marginBottom: '8px', fontSize: '0.9rem' }}>FINAL ANSWER</div>
               
               {questProgress.final_answer ? (
                 <button className="btn-game btn-play" style={{ width: '100%', padding: '12px' }} onClick={finishQuest}>
                    FINISH QUEST <ArrowRight size={18} />
                 </button>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                      <input 
                        type="number" 
                        placeholder="???" 
                        value={finalVal}
                        onChange={(e) => setFinalVal(e.target.value)}
                        style={{ width: '80px', padding: '8px', borderRadius: '8px', border: '2px solid var(--wood)', fontSize: '1rem', textAlign: 'center', fontWeight: '800' }} 
                      />
                      <span style={{ fontWeight: '700', color: 'var(--wood)', fontSize: '0.8rem' }}>{quest.answer.unit}</span>
                    </div>
                    <button className="btn-game btn-submit" onClick={handleFinalSubmit} style={{ padding: '8px', fontSize: '0.9rem' }}>
                       SOLVE CHALLENGE
                    </button>
                    
                    {!questProgress.final_answer && (
                      <div style={{ marginTop: '4px' }}>
                        {showFinalHint ? (
                          <div style={{ color: 'var(--wood)', fontSize: '0.7rem', fontStyle: 'italic', background: '#fef3c7', padding: '8px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                            💡 {quest.hint.text}
                          </div>
                        ) : (
                          <button 
                            onClick={() => { if(useCard()) setShowFinalHint(true); }} 
                            style={{ background: 'none', border: 'none', color: 'var(--wood)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold', textDecoration: 'underline', opacity: cards > 0 ? 1 : 0.5 }}
                          >
                            NEED A CALCULATION HINT? (1 CARD)
                          </button>
                        )}
                      </div>
                    )}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
