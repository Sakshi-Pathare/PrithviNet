import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import CommunityStatsBar from './components/CommunityStatsBar';
import Feed from './components/Feed';
import MapPage from './components/MapPage';
import GroupsPage from './components/GroupsPage';
import RewardsPage from './components/RewardsPage';
import ProfilePage from './components/ProfilePage';
import UploadModal from './components/UploadModal';
import Toast from './components/Toast';
import { fetchUserMe } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [newlyCreatedPost, setNewlyCreatedPost] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const userData = await fetchUserMe(1);
      setUser(userData);
    }
    loadUser();
  }, []);

  const showToast = ({ type = 'success', title, message }) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4500);
  };

  const handlePointsUpdate = (newPoints) => {
    setUser(prev => prev ? { ...prev, green_points: newPoints } : prev);
  };

  const handleTabChange = (newTab) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(() => {
        setActiveTab(newTab);
      });
    } else {
      setActiveTab(newTab);
    }
  };

  const handlePostCreated = (newPost) => {
    setUser(prev => prev ? {
      ...prev,
      green_points: prev.green_points + (newPost.points_awarded || 50)
    } : prev);
    setNewlyCreatedPost(newPost);
    handleTabChange('feed');
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#2C4A3E] flex flex-col font-sans selection:bg-[#7C9D8E] selection:text-white relative overflow-x-hidden">

      {/* ── Global Ambient Background Blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right warm blob */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#E8EFEA]/50 via-[#D4E5DC]/30 to-transparent blur-3xl" />
        {/* Bottom-left sage blob */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#7C9D8E]/10 to-transparent blur-3xl" />
        {/* Center subtle warmth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-r from-[#FAF8F5]/40 to-[#EFECE4]/40 blur-3xl" />
      </div>

      {/* ── Navigation Header ── */}
      <div className="relative z-20">
        <Header
          user={user}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />
        {activeTab !== 'map' && <CommunityStatsBar />}
      </div>

      {/* ── Main Content Area (with bottom padding for mobile navigation) ── */}
      <main className="flex-1 w-full relative z-10 pb-24 md:pb-8">

        {activeTab === 'feed' && (
          <div className="page-enter">
            <Feed
              user={user}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onToast={showToast}
              setActiveTab={handleTabChange}
              newlyCreatedPost={newlyCreatedPost}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="page-enter">
            <MapPage onOpenUploadModal={() => setIsUploadModalOpen(true)} />
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="page-enter">
            <GroupsPage
              user={user}
              onUserUpdated={setUser}
              onToast={showToast}
            />
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="page-enter">
            <RewardsPage
              user={user}
              onPointsUpdate={handlePointsUpdate}
              onToast={showToast}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="page-enter">
            <ProfilePage
              user={user}
              onUserUpdated={setUser}
              onToast={showToast}
              setActiveTab={handleTabChange}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              newlyCreatedPost={newlyCreatedPost}
            />
          </div>
        )}
      </main>

      {/* ── Fixed Mobile Bottom Navigation Bar ── */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* ── Upload Modal ── */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPostCreated={handlePostCreated}
        user={user}
        onToast={showToast}
      />

      {/* ── Toast Notifications ── */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
