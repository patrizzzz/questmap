import React, { useState, useMemo } from 'react';
import { useGame } from './GameState';
import { Check, Lock, Play } from 'lucide-react';

export const QuestMap = ({ setBg }) => {
  const { 
    allQuests, unlockedLevels, startQuest, currentLevelId, 
    currentView, setCurrentLevelId 
  } = useGame();
  
  const [hoveredNode, setHoveredNode] = useState(null);

  // Layout Stages
  const stages = [
    { name: 'Addition Meadows', topic: 'addition', bg: '/bg_meadows.png', color: '#a3e635' },
    { name: 'Subtraction Springs', topic: 'subtraction', bg: '/bg_springs.png', color: '#38bdf8' },
    { name: 'Multiplication Mountains', topic: 'multiplication', bg: '/bg_mountains.png', color: '#f59e0b' },
    { name: 'Division Delta', topic: 'division', bg: '/bg_meadows.png', color: '#a78bfa' },
  ];

  // Precise Map Coordinates following a winding "S" path
  const topicPositions = {
    addition: [
      { x: 10, y: 88 }, { x: 20, y: 78 }, { x: 30, y: 85 }, { x: 42, y: 92 }, { x: 55, y: 85 }
    ],
    subtraction: [
      { x: 50, y: 70 }, { x: 38, y: 62 }, { x: 25, y: 55 }, { x: 15, y: 45 }, { x: 10, y: 32 }
    ],
    multiplication: [
      { x: 22, y: 22 }, { x: 38, y: 15 }, { x: 55, y: 20 }, { x: 72, y: 25 }, { x: 88, y: 35 }
    ],
    division: [
      { x: 82, y: 50 }, { x: 72, y: 65 }, { x: 82, y: 80 }, { x: 70, y: 92 }, { x: 88, y: 90 }
    ]
  };

  const allPoints = useMemo(() => {
    const points = [];
    ['addition', 'subtraction', 'multiplication', 'division'].forEach(topic => {
      topicPositions[topic].forEach(pos => {
        points.push(pos);
      });
    });
    return points;
  }, []);

  const generatePathData = (points) => {
    if (!points.length) return "";
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const cp1x = p1.x + (p2.x - p1.x) / 2;
        const cp1y = p1.y;
        const cp2x = p2.x - (p2.x - p1.x) / 2;
        const cp2y = p2.y;
        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const pathData = generatePathData(allPoints);

  const handleMouseEnterNode = (quest) => {
    setHoveredNode(quest.quest_id);
    if (unlockedLevels.includes(quest.quest_id)) {
       if (quest.topic === 'addition') setBg('/bg_meadows.png');
       else if (quest.topic === 'subtraction') setBg('/bg_springs.png');
       else if (quest.topic === 'multiplication') setBg('/bg_mountains.png');
       else if (quest.topic === 'division') setBg('/bg_meadows.png');
    }
  };

  const handleMouseLeaveNode = () => {
    setHoveredNode(null);
    const activeQuest = allQuests.find(q => q.quest_id === currentLevelId);
    if (activeQuest) {
       if (activeQuest.topic === 'addition') setBg('/bg_meadows.png');
       else if (activeQuest.topic === 'subtraction') setBg('/bg_springs.png');
       else if (activeQuest.topic === 'multiplication') setBg('/bg_mountains.png');
       else if (activeQuest.topic === 'division') setBg('/bg_meadows.png');
    }
  };

  const handleNodeClick = (quest) => {
    if (unlockedLevels.includes(quest.quest_id)) {
      setCurrentLevelId(quest.quest_id);
    }
  };

  return (
    <div style={{width: '100%', height: '100%', position: 'relative', overflow: 'hidden'}}>
      
      {/* SVG Trail Layer */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))',
        zIndex: 0
      }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="1.5" result="blur"/>
             <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <path d={pathData} fill="none" stroke="rgba(253, 224, 71, 0.4)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 3" />
        
        <path 
           d={pathData} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" 
           strokeDasharray="6 4" className="trail-flow" 
           style={{ filter: 'url(#glow)', opacity: 0.6 }}
        />
      </svg>

      {/* Stage Labels */}
      {stages.map((stage, idx) => {
        const topicQuests = allQuests.filter(q => q.topic === stage.topic);
        if (!topicQuests.length) return null;
        const centerQuestIdx = Math.floor(topicQuests.length / 2);
        const pos = topicPositions[stage.topic][centerQuestIdx];

        return (
          <div key={idx} style={{
             position: 'absolute', left: `${pos.x}%`, top: `${pos.y + 12}%`,
             background: 'var(--wood)', color: 'var(--gold)', padding: '4px 16px', borderRadius: '8px',
             fontWeight: '800', fontSize: '0.8rem', zIndex: 5, border: `2px solid var(--gold)`,
             transform: 'translate(-50%, 0)', pointerEvents: 'none', whiteSpace: 'nowrap',
             boxShadow: '0 4px 10px rgba(0,0,0,0.5)', textTransform: 'uppercase'
          }}>
            {stage.name}
          </div>
        )
      })}

      {/* Quest Nodes */}
      {allQuests.map((quest) => {
        const topicQuests = allQuests.filter(q => q.topic === quest.topic);
        const questIdx = topicQuests.findIndex(q => q.quest_id === quest.quest_id);
        const pos = topicPositions[quest.topic][questIdx];

        const isUnlocked = unlockedLevels.includes(quest.quest_id);
        const isCompleted = isUnlocked && quest.quest_id !== currentLevelId && unlockedLevels.includes(quest.reward.next_quest);
        const isActive = isUnlocked && quest.quest_id === currentLevelId;
        
        let nodeClass = "map-node";
        if (isActive) nodeClass += " active";
        else if (isUnlocked) nodeClass += " unlocked";

        return (
          <div 
             key={quest.quest_id}
             className="map-node-wrapper"
             style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
             onMouseEnter={() => handleMouseEnterNode(quest)}
             onMouseLeave={handleMouseLeaveNode}
          >
             {isActive && (
                <div style={{
                  position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)',
                  width: '50px', height: '50px', borderRadius: '12px', border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6)', zIndex: 100, overflow: 'hidden',
                  background: 'white', animation: 'float 2s infinite ease-in-out'
                }}>
                  <img src="/avatar.png" alt="You" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
             )}

             {(hoveredNode === quest.quest_id || (isActive && currentView === 'map')) && (
               <div className="node-popover animate-pop" style={{ border: '3px solid var(--wood)' }}>
                  <div style={{fontWeight: '800', fontSize: '0.85rem', color: 'var(--wood)'}}>{quest.topic.toUpperCase()}</div>
                  <div style={{fontSize: '0.75rem', margin: '4px 0', color: '#64748b'}}>{quest.title}</div>
                  
                  {isUnlocked && (
                     <button className="btn-premium" onClick={() => startQuest(quest.quest_id)} style={{marginTop: '4px', padding: '10px 16px', fontSize: '0.9rem', width: '100%'}}>
                        <Play fill="var(--wood)" color="var(--wood)" size={16} /> PLAY
                     </button>
                  )}
               </div>
             )}

             <div className={nodeClass} onClick={() => handleNodeClick(quest)}>
               {!isUnlocked && <Lock size={20} color="white" />}
               {isActive && <span>{questIdx + 1}</span>}
               {isCompleted && <Check size={32} color="var(--wood)" />}
               {isUnlocked && !isActive && !isCompleted && <span>{questIdx + 1}</span>}
             </div>
          </div>
        );
      })}
    </div>
  );
};
