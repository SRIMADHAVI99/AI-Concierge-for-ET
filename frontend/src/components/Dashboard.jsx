import React from 'react';
import { UserCircle } from 'lucide-react';

const Dashboard = ({ profile }) => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in flex flex-col gap-6" style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Section */}
      <div className="glass-panel p-8" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-panel)' }}>
        <div style={{ height: '80px', width: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <UserCircle size={48} color="#000" />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Your Personalized ET Plan</h2>
          <p style={{ color: 'var(--text-muted)' }}>We've processed your unified profile. Here is your actionable, intelligent report.</p>
        </div>
      </div>

      {/* The AI Generated Premium Report */}
      <div className="glass-panel gold-glow" style={{ padding: '2.5rem', background: 'rgba(10, 15, 30, 0.85)' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>AI Concierge Recommendations</h3>
        
        <div style={{ color: '#f0f4f8', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif' }}>
          {profile.fullReport}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
         <button className="btn-primary" onClick={() => window.location.reload()} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            Restart Concierge Session
         </button>
      </div>
    </div>
  );
};

export default Dashboard;
