import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CommunityStatsBar from './components/CommunityStatsBar';
import Feed from './components/Feed';
import MapPage from './components/MapPage';
import GroupsPage from './components/GroupsPage';
import RewardsPage from './components/RewardsPage';
import UploadModal from './components/UploadModal';
import Toast from './components/Toast';
import { fetchUserMe } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const userData = await fetchUserMe(1);
      setUser(userData);
    }
    loadUser();
  }, []);

  const showToast = ({ type = 'success', title, message }) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handlePointsUpdate = (newPoints) => {
    setUser(prev => prev ? { ...prev, green_points: newPoints } : prev);
  };

  const handlePostCreated = (newPost) => {
    // Add awarded points to current user state
    setUser(prev => prev ? {
      ...prev,
      green_points: prev.green_points + (newPost.points_awarded || 50)
    } : prev);

    // Switch to Home Feed to view the newly posted action
    setActiveTab('feed');
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#2C4A3E] flex flex-col font-sans selection:bg-[#7C9D8E] selection:text-white">
      
      {/* PrithviNet Navigation Header */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Community Stats Bar */}
      <CommunityStatsBar />

      {/* Main View Area */}
      <main className="flex-1 w-full relative">
        {activeTab === 'feed' && (
          <Feed
            user={user}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onToast={showToast}
          />
        )}

        {activeTab === 'map' && (
          <MapPage
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'groups' && (
          <GroupsPage
            user={user}
            onUserUpdated={setUser}
            onToast={showToast}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsPage
            user={user}
            onPointsUpdate={handlePointsUpdate}
            onToast={showToast}
          />
        )}
      </main>

      {/* 2-Step Action Poster Wizard Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPostCreated={handlePostCreated}
        user={user}
        onToast={showToast}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
