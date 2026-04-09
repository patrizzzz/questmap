import React from 'react';
import { X, CheckCircle, Lightbulb, Map as MapIcon, Target } from 'lucide-react';

export const InstructionsModal = ({ onClose }) => {
  return (
    <div className="success-overlay" style={{ zIndex: 10000 }}>
      <div className="success-card animate-pop" style={{ maxWidth: '800px', width: '90%', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '3px solid var(--wood)', paddingBottom: '10px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--wood)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <MapIcon size={40} /> HOW TO PLAY
          </h2>
          <button className="btn-game" onClick={onClose} style={{ background: 'var(--danger)', padding: '10px' }}>
            <X size={24} color="white" />
          </button>
        </div>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-main)' }}>
          <section className="instruction-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)' }}>
              <Target size={20} /> YOUR ADVENTURE
            </h3>
            <p>Welcome to <strong>Math-Laro: Bislig Edition!</strong> You are an explorer traveling through Leyte. Your goal is to clear 20 math quests across the map to become the ultimate Bislig Guardian.</p>
          </section>

          <section className="instruction-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
              <X size={20} style={{ transform: 'rotate(45deg)' }} /> THE DECODING SHIELD
            </h3>
            <p>Every quest requires you to power up your <strong>Decoding Shield</strong> by answering four logic questions:</p>
            <ul style={{ marginLeft: '25px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>1. What is Asked?</strong> - Find what the problem is looking for.</li>
              <li><strong>2. What are Given?</strong> - Identify the numbers and facts provided.</li>
              <li><strong>3. Logic Gate</strong> - Choose the correct operation (+, -, x, ÷).</li>
              <li><strong>4. Sentence</strong> - Translate the problem into a math sentence.</li>
            </ul>
          </section>

          <section className="instruction-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-dark)' }}>
              <Lightbulb size={20} /> REWARDS & HINTS
            </h3>
            <p>Solve steps correctly to earn <strong>Math-Coins</strong>. If you get stuck for too long, you can use a <strong>Power-Card</strong> to reveal a hint. You earn new cards by completing quests!</p>
          </section>

          <div style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-parchment)', borderRadius: '12px', border: '2px dashed var(--wood)', textAlign: 'center' }}>
            <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>Ready to start your journey, Explorer?</p>
            <button className="btn-premium" style={{ marginTop: '15px', width: '200px', marginInline: 'auto' }} onClick={onClose}>
              LET'S GO!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
