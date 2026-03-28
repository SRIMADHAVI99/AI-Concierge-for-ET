import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';

function App() {
  const [profile, setProfile] = useState(null);

  const handleChatComplete = (userProfile) => {
    setProfile(userProfile);
  };

  return (
    <div className="app-container" style={{ maxWidth: '1400px' }}>
      <header className="header animate-fade-in" style={{ marginBottom: '1rem' }}>
        <h1>ET AI Concierge</h1>
        <p>Your Intelligent Guide to the Economic Times Ecosystem</p>
      </header>

      <main style={{ width: '100%', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ flex: profile ? '0 0 40%' : '1', transition: 'all 0.5s ease', maxWidth: profile ? '500px' : '800px', width: '100%', margin: profile ? '0' : '0 auto' }}>
          <ChatInterface onComplete={handleChatComplete} />
        </div>
        
        {profile && (
          <div style={{ flex: '1', animation: 'fadeIn 0.8s ease' }}>
            <Dashboard profile={profile} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
