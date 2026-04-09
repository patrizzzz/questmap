import React from 'react';
import { X, User, Coins, Trash2, Map as MapIcon } from 'lucide-react';

export const ProfilesModal = ({ users, onSelect, onDelete, onClose }) => {
  return (
    <div className="success-overlay" style={{ zIndex: 10000 }}>
      <div className="success-card animate-pop" style={{ maxWidth: '500px', width: '90%', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '3px solid var(--wood)', paddingBottom: '10px' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--wood)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={30} /> EXPLORERS
          </h2>
          <button className="btn-game" onClick={onClose} style={{ background: 'var(--danger)', padding: '5px' }}>
            <X size={20} color="white" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', padding: '5px' }}>
          {users.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
              <p>No saved explorers found.</p>
              <p style={{ fontSize: '0.8rem' }}>Start a New Game to create one!</p>
            </div>
          ) : (
            users.map((user) => (
              <div 
                key={user.name}
                className="glass-widget"
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 15px', 
                  cursor: 'pointer',
                  borderWidth: '2px',
                  background: 'white',
                  transition: 'transform 0.2s'
                }}
                onClick={() => onSelect(user.name)}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--wood)' }}>{user.name}</div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapIcon size={14} /> {user.quests} Quests
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Coins size={14} /> {user.coins} Coins
                    </span>
                  </div>
                </div>
                
                <button 
                  className="btn-game"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete data for ${user.name}?`)) onDelete(user.name);
                  }}
                  style={{ background: 'none', boxShadow: 'none', border: 'none', color: '#ef4444' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <button className="btn-premium" style={{ width: '100%', padding: '12px' }} onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
