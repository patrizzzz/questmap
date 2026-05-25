import React from 'react';
import { useGame } from './GameState';
import { X, Trophy, Coins, Award, Calendar, CheckCircle2, Bookmark, BarChart3, Star } from 'lucide-react';

export const StatsModal = ({ onClose }) => {
  const { history, score, coins, playerName, unlockedLevels } = useGame();

  const totalQuestsCount = 20;
  const completedCount = history.length;
  const progressPercent = Math.round((completedCount / totalQuestsCount) * 100);

  // Grouped regional progress counts
  const regionalStats = {
    addition: {
      name: 'Emerald Fields (Addition)',
      completed: history.filter(e => e.topic === 'addition').length,
      total: 5,
      color: '#84cc16'
    },
    subtraction: {
      name: 'Crystal Springs (Subtraction)',
      completed: history.filter(e => e.topic === 'subtraction').length,
      total: 5,
      color: '#0ea5e9'
    },
    multiplication: {
      name: 'Golden Peaks (Multiplication)',
      completed: history.filter(e => e.topic === 'multiplication').length,
      total: 5,
      color: '#f59e0b'
    },
    division: {
      name: 'Mystic Valleys (Division)',
      completed: history.filter(e => e.topic === 'division').length,
      total: 5,
      color: '#8b5cf6'
    }
  };

  const achievements = [
    {
      id: 'pioneer',
      name: 'Bislig Pioneer',
      description: 'Completed your first math quest!',
      icon: '🧭',
      unlocked: completedCount >= 1,
      color: '#22c55e'
    },
    {
      id: 'meadows',
      name: 'Meadow Master',
      description: 'Solved all Addition Meadows quests.',
      icon: '🌿',
      unlocked: regionalStats.addition.completed === 5,
      color: '#84cc16'
    },
    {
      id: 'springs',
      name: 'Spring Survivor',
      description: 'Solved all Subtraction Springs quests.',
      icon: '💧',
      unlocked: regionalStats.subtraction.completed === 5,
      color: '#0ea5e9'
    },
    {
      id: 'mountains',
      name: 'Mountain Climber',
      description: 'Solved all Multiplication Mountains quests.',
      icon: '⛰️',
      unlocked: regionalStats.multiplication.completed === 5,
      color: '#f59e0b'
    },
    {
      id: 'delta',
      name: 'Delta Conqueror',
      description: 'Solved all Division Delta quests.',
      icon: '🌊',
      unlocked: regionalStats.division.completed === 5,
      color: '#8b5cf6'
    },
    {
      id: 'guardian',
      name: 'Grand Guardian',
      description: 'Protected Bislig by completing all 20 quests!',
      icon: '👑',
      unlocked: completedCount === 20,
      color: '#e11d48'
    }
  ];

  const unlockedBadgesCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="success-overlay" style={{ zIndex: 10000 }}>
      <div className="stats-card animate-pop">
        
        {/* Modal Header */}
        <div className="stats-header">
          <h2 className="stats-header-title">
            <Trophy size={36} color="var(--gold)" fill="var(--gold-dark)" />
            <span>EXPLORER LOG & STATS</span>
          </h2>
          <button className="btn-game btn-close-stats" onClick={onClose}>
            <X size={22} color="white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="stats-body-grid">
          
          {/* LEFT COLUMN: Overview, Regional Mastery & Badges */}
          <div className="stats-column-left">
            
            {/* Explorer Info Widget */}
            <div className="stats-widget explorer-card">
              <div className="explorer-card-header">
                <div className="explorer-card-avatar">
                  <img src="/avatar.png" alt="Avatar" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 className="explorer-card-name">{playerName}</h3>
                  <div className="explorer-card-rank">Bislig Math Guardian</div>
                </div>
              </div>

              <div className="explorer-stats-row">
                <div className="explorer-stat-item">
                  <div className="explorer-stat-label">TOTAL SCORE</div>
                  <div className="explorer-stat-value" style={{ color: 'var(--gold-dark)' }}>
                    <Star size={18} fill="var(--gold)" style={{ marginRight: '4px' }} />
                    {score}
                  </div>
                </div>
                <div className="explorer-stat-item">
                  <div className="explorer-stat-label">MATH-COINS</div>
                  <div className="explorer-stat-value" style={{ color: 'var(--wood-light)' }}>
                    <Coins size={18} color="var(--gold-dark)" style={{ marginRight: '4px' }} />
                    {coins}
                  </div>
                </div>
                <div className="explorer-stat-item">
                  <div className="explorer-stat-label">BADGES</div>
                  <div className="explorer-stat-value" style={{ color: '#ec4899' }}>
                    <Award size={18} style={{ marginRight: '4px' }} />
                    {unlockedBadgesCount}/6
                  </div>
                </div>
              </div>

              {/* General Progress Bar */}
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '800', color: 'var(--wood)', marginBottom: '5px' }}>
                  <span>OVERALL JOURNEY PROGRESS</span>
                  <span>{completedCount} / {totalQuestsCount} Quests ({progressPercent}%)</span>
                </div>
                <div className="stats-progress-container">
                  <div className="stats-progress-bar" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Regional Mastery progress bars */}
            <div className="stats-widget">
              <h3 className="stats-section-title">
                <BarChart3 size={18} style={{ color: 'var(--primary)' }} /> REGIONAL MASTERY
              </h3>
              <div className="regional-bars-list">
                {Object.keys(regionalStats).map(key => {
                  const region = regionalStats[key];
                  const percent = Math.round((region.completed / region.total) * 100);
                  return (
                    <div key={key} className="regional-stat-row">
                      <div className="regional-stat-info">
                        <span className="regional-stat-name">{region.name}</span>
                        <span className="regional-stat-count">{region.completed} / {region.total}</span>
                      </div>
                      <div className="stats-progress-container-small">
                        <div 
                          className="stats-progress-bar-small animate-bar" 
                          style={{ width: `${percent}%`, backgroundColor: region.color }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements / Badges */}
            <div className="stats-widget">
              <h3 className="stats-section-title">
                <Award size={18} style={{ color: '#ec4899' }} /> GUARDIAN BADGES
              </h3>
              <div className="badges-grid">
                {achievements.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}
                    style={{ borderColor: badge.unlocked ? badge.color : '#cbd5e1' }}
                    title={`${badge.name}: ${badge.description}`}
                  >
                    <div className="badge-icon-wrapper" style={{ background: badge.unlocked ? `${badge.color}22` : '#f1f5f9' }}>
                      <span className="badge-icon">{badge.icon}</span>
                    </div>
                    <div className="badge-info">
                      <div className="badge-name">{badge.name}</div>
                      <div className="badge-description">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Chronological Quest History Log */}
          <div className="stats-column-right">
            <div className="stats-widget history-widget">
              <h3 className="stats-section-title" style={{ marginBottom: '15px' }}>
                <Calendar size={18} style={{ color: 'var(--gold-dark)' }} /> QUEST RESOLUTION HISTORY LOG
              </h3>

              {history.length === 0 ? (
                <div className="history-empty-state">
                  <Bookmark size={48} color="#94a3b8" />
                  <p className="empty-title">Your Chronicle is Empty!</p>
                  <p className="empty-subtitle">Play and complete quests on the map to begin writing your history.</p>
                </div>
              ) : (
                <div className="history-table-container">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>QUEST TITLE</th>
                        <th>TOPIC</th>
                        <th>REWARD</th>
                        <th>COMPLETED DATE & TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Show history in reverse chronological order (newest first) */}
                      {[...history].reverse().map((entry, idx) => (
                        <tr key={idx} className="history-row">
                          <td style={{ fontWeight: '800', color: 'var(--wood)' }}>{entry.title}</td>
                          <td>
                            <span 
                              className="history-topic-tag"
                              style={{ 
                                backgroundColor: regionalStats[entry.topic]?.color + '15',
                                color: regionalStats[entry.topic]?.color,
                                borderColor: regionalStats[entry.topic]?.color
                              }}
                            >
                              {entry.topic.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ color: 'var(--gold-dark)', fontWeight: '800' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Coins size={14} color="var(--gold-dark)" />
                              +{entry.coinsEarned}
                            </div>
                          </td>
                          <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{entry.completedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn-premium" style={{ padding: '12px 30px', fontSize: '1.1rem' }} onClick={onClose}>
            BACK TO ADVENTURE
          </button>
        </div>

      </div>
    </div>
  );
};
