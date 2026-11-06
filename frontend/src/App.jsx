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
import AuthModal from './components/AuthModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import DirectMessagesModal from './components/DirectMessagesModal';
import Toast from './components/Toast';
import { 
  fetchUserMe, fetchAuthMe, clearStoredAuthToken,
  fetchNotifications, markNotificationRead, markAllNotificationsRead, respondFollowRequest,
  fetchConversations
} from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [toast, setToast] = useState(null);
  const [newlyCreatedPost, setNewlyCreatedPost] = useState(null);

  // Social & Messaging State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isDMsOpen, setIsDMsOpen] = useState(false);
  const [dmsTargetUser, setDmsTargetUser] = useState(null);
  const [unreadDMsCount, setUnreadDMsCount] = useState(2);

  useEffect(() => {
    async function loadUser() {
      // 1. Try restoring authenticated user from token
      const authUser = await fetchAuthMe();
      if (authUser) {
        setUser(authUser);
        return;
      }
      // 2. Default to active Pune community profile
      const defaultData = await fetchUserMe(1);
      setUser(defaultData);
    }
    loadUser();
  }, []);

  // Load notifications and conversations periodically
  useEffect(() => {
    async function loadSocial() {
      try {
        const notifs = await fetchNotifications();
        setNotifications(notifs);
        const convs = await fetchConversations();
        const unread = convs.reduce((acc, c) => acc + (c.unread_count || 0), 0);
        setUnreadDMsCount(unread);
      } catch (e) {}
    }
    loadSocial();
  }, [user]);

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  const handleMarkNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await markNotificationRead(id);
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await markAllNotificationsRead();
    showToast({ type: 'success', title: 'Marked All Read', message: 'All notifications cleared.' });
  };

  const handleRespondFollow = async (id, action) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: action, is_read: true } : n));
    await respondFollowRequest(id, action);
  };

  const handleOpenDMsWithUser = (targetUser) => {
    setDmsTargetUser(targetUser);
    setIsDMsOpen(true);
  };

  const showToast = ({ type = 'success', title, message }) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4500);
  };

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    clearStoredAuthToken();
    setUser(null);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out. You can browse public actions or sign in anytime.'
    });
    handleTabChange('feed');
  };

  const handleOpenUploadModal = () => {
    if (!user) {
      showToast({
        type: 'info',
        title: 'Sign In Required 🌱',
        message: 'Create a free account or sign in to verify your action and earn Green Points!'
      });
      handleOpenAuthModal('signup');
    } else {
      setIsUploadModalOpen(true);
    }
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
          onOpenUploadModal={handleOpenUploadModal}
          onOpenAuthModal={handleOpenAuthModal}
          onLogout={handleLogout}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenDMs={() => { setDmsTargetUser(null); setIsDMsOpen(true); }}
          unreadDMsCount={unreadDMsCount}
        />
        {activeTab !== 'map' && <CommunityStatsBar />}
      </div>

      {/* ── Main Content Area (with bottom padding for mobile navigation) ── */}
      <main className="flex-1 w-full relative z-10 pb-24 md:pb-8">

        {activeTab === 'feed' && (
          <div className="page-enter">
            <Feed
              user={user}
              onOpenUploadModal={handleOpenUploadModal}
              onToast={showToast}
              setActiveTab={handleTabChange}
              newlyCreatedPost={newlyCreatedPost}
              onOpenDMsWithUser={handleOpenDMsWithUser}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="page-enter">
            <MapPage onOpenUploadModal={handleOpenUploadModal} />
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
              onOpenUploadModal={handleOpenUploadModal}
              newlyCreatedPost={newlyCreatedPost}
            />
          </div>
        )}
      </main>

      {/* ── Fixed Mobile Bottom Navigation Bar ── */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenUploadModal={handleOpenUploadModal}
      />

      {/* ── Upload Modal ── */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPostCreated={handlePostCreated}
        user={user}
        onToast={showToast}
      />

      {/* ── Sign In / Sign Up Auth Modal ── */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onToast={showToast}
        initialMode={authModalMode}
      />

      {/* ── Notifications & Follow Requests Drawer (Instagram / FB) ── */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onRespondFollow={handleRespondFollow}
        onToast={showToast}
      />

      {/* ── Direct Messages & Instant Chat Modal (Instagram DM / WhatsApp) ── */}
      <DirectMessagesModal
        isOpen={isDMsOpen}
        onClose={() => setIsDMsOpen(false)}
        currentUser={user}
        onToast={showToast}
        initialTargetUser={dmsTargetUser}
      />

      {/* ── Toast Notifications ── */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
