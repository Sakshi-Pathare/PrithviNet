import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Smile, Phone, Video, Search, CheckCheck, 
  Leaf, Users, Sparkles, MessageCircle, MoreVertical
} from 'lucide-react';
import { fetchConversations, fetchMessageThread, sendChatMessage, reactToChatMessage } from '../api';

const QUICK_CHIPS = [
  "Count me in for Sunday! 🌱",
  "Where is the meeting spot?",
  "Shared my cleanup photo! 📸",
  "Need extra sapling bags? 🌿"
];

const REACTION_OPTIONS = ['🌱', '❤️', '👏', '🔥', '🙌'];

export default function DirectMessagesModal({
  isOpen,
  onClose,
  currentUser,
  onToast,
  initialTargetUser
}) {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversations on open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    async function load() {
      try {
        const convs = await fetchConversations();
        if (isMounted) {
          setConversations(convs);
          if (initialTargetUser) {
            const found = convs.find(c => c.target_id === initialTargetUser.id);
            if (found) {
              setActiveConv(found);
            } else {
              const newConv = {
                id: `u_${initialTargetUser.id}`,
                target_type: 'user',
                target_id: initialTargetUser.id,
                name: initialTargetUser.name,
                avatar: initialTargetUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
                last_message: 'Started new direct chat',
                last_message_time: new Date().toISOString(),
                unread_count: 0,
                is_online: true
              };
              setConversations([newConv, ...convs]);
              setActiveConv(newConv);
            }
          } else if (convs.length > 0) {
            setActiveConv(convs[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [isOpen, initialTargetUser]);

  // Load message thread when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    let isMounted = true;
    async function loadThread() {
      setIsLoadingMessages(true);
      try {
        const list = await fetchMessageThread(activeConv.target_type, activeConv.target_id);
        if (isMounted) {
          setMessages(list);
        }
      } catch (err) {
        console.error('Failed to load thread:', err);
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    }
    loadThread();
    return () => { isMounted = false; };
  }, [activeConv]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConv) return;

    const tempMsg = {
      id: `m_${Date.now()}`,
      sender_id: currentUser?.id || 1,
      sender_name: currentUser?.name || 'You',
      sender_avatar: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      text,
      reaction: null,
      is_read: false,
      created_at: new Date().toISOString(),
      is_mine: true
    };

    setMessages(prev => [...prev, tempMsg]);
    setInputText('');

    try {
      const saved = await sendChatMessage(activeConv.target_type, activeConv.target_id, text);
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? { ...saved, is_mine: true } : m));

      // Friendly simulated instant community reply after 2 seconds for a realistic live platform feel!
      if (activeConv.target_type === 'user') {
        setTimeout(() => {
          const autoReplies = [
            "Awesome! Glad to coordinate with you on this Pune green initiative! 🌱",
            "Noted! Let's make an impactful difference together! 💚",
            "Got it! See you at the drive this weekend!"
          ];
          const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const replyMsg = {
            id: `reply_${Date.now()}`,
            sender_id: activeConv.target_id,
            sender_name: activeConv.name,
            sender_avatar: activeConv.avatar,
            text: replyText,
            reaction: '🌱',
            is_read: true,
            created_at: new Date().toISOString(),
            is_mine: false
          };
          setMessages(mList => [...mList, replyMsg]);
        }, 1800);
      }
    } catch (err) {
      onToast?.({ type: 'info', title: 'Note', message: err.message || 'Message sent locally.' });
    }
  };

  const handleReact = async (msgId, emoji) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reaction: m.reaction === emoji ? null : emoji } : m));
    await reactToChatMessage(msgId, emoji);
  };

  if (!isOpen) return null;

  const filteredConvs = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[92vh] max-h-[700px] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DDD1] flex overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Left Sidebar: Conversations list */}
        <div className={`w-full sm:w-80 md:w-96 border-r border-[#E2DDD1] bg-white flex flex-col ${
          activeConv ? 'hidden sm:flex' : 'flex'
        }`}>
          {/* Top header */}
          <div className="p-4 border-b border-[#E2DDD1] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E8EFEA] flex items-center justify-center text-[#2C4A3E]">
                <MessageCircle className="w-4 h-4 text-[#587B6C]" />
              </div>
              <h2 className="font-display font-bold text-base text-[#2C4A3E]">Direct Messages</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[#F5F2EB] text-[#8C857B] hover:text-[#2C4A3E] sm:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-[#E2DDD1]/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C857B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search volunteers or groups..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F5F2EB] border-transparent text-xs text-[#2C4A3E] focus:outline-none focus:bg-white focus:border-[#587B6C]"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E2DDD1]/40">
            {filteredConvs.map((conv) => {
              const isSelected = activeConv && activeConv.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#E8EFEA]/70' : 'hover:bg-[#F5F2EB]/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-[#E2DDD1]"
                    />
                    {conv.is_online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-xs font-bold text-[#2C4A3E] truncate">{conv.name}</p>
                      <span className="text-[10px] text-[#8C857B] shrink-0">
                        {conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C857B] truncate">{conv.last_message}</p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#587B6C] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-[#FAF8F5]">
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-[#E2DDD1] bg-white flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveConv(null)}
                  className="sm:hidden p-1.5 rounded-xl hover:bg-[#F5F2EB] text-[#8C857B]"
                >
                  ←
                </button>
                <div className="relative shrink-0">
                  <img
                    src={activeConv.avatar}
                    alt={activeConv.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#E2DDD1]"
                  />
                  {activeConv.is_online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm text-[#2C4A3E] truncate">{activeConv.name}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Now · Pune Green Network</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#8C857B]">
                <button 
                  onClick={() => onToast?.({ type: 'info', title: 'Pune Green Hotline', message: 'Direct eco-coordinator voice calls live soon!' })}
                  className="p-2 rounded-xl hover:bg-[#F5F2EB] transition-colors"
                  title="Voice call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onToast?.({ type: 'info', title: 'Video Meet', message: 'Group eco-drive video briefs live soon!' })}
                  className="p-2 rounded-xl hover:bg-[#F5F2EB] transition-colors"
                  title="Video call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-[#F5F2EB] text-[#8C857B] hover:text-[#2C4A3E] transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-[#587B6C] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-[#E8EFEA] flex items-center justify-center mx-auto mb-2 text-[#587B6C]">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <p className="font-display font-bold text-sm text-[#2C4A3E]">Say hello to {activeConv.name}!</p>
                  <p className="text-xs text-[#8C857B] mt-1">Coordinate cleanups, tree drives, and seed exchanges.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.is_mine;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group`}
                    >
                      <div className="flex items-end gap-1.5 max-w-[80%]">
                        {!isMine && (
                          <img
                            src={m.sender_avatar || activeConv.avatar}
                            alt={m.sender_name}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                          />
                        )}
                        <div className={`relative px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? 'bg-[#2C4A3E] text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-[#2C4A3E] border border-[#E2DDD1] rounded-bl-xs shadow-xs'
                        }`}>
                          <p className="break-words">{m.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                            isMine ? 'text-white/70' : 'text-[#8C857B]'
                          }`}>
                            <span>
                              {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                            {isMine && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                          </div>

                          {/* Reaction badge */}
                          {m.reaction && (
                            <div className="absolute -bottom-2 right-2 px-1.5 py-0.2 bg-white rounded-full shadow-xs border border-[#E2DDD1] text-xs">
                              {m.reaction}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Emoji reaction picker on hover */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1 px-1">
                        {REACTION_OPTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReact(m.id, emoji)}
                            className="p-1 rounded-full hover:bg-white text-[11px] hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips scroller */}
            <div className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-[#E2DDD1]/50 bg-[#FAF8F5]">
              {QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-[#E8EFEA] text-[11px] font-medium text-[#2C4A3E] border border-[#E2DDD1] whitespace-nowrap transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#E2DDD1]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeConv.name}...`}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F2EB] border border-transparent text-xs text-[#2C4A3E] focus:outline-none focus:bg-white focus:border-[#587B6C] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setInputText(prev => prev + " 🌱")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm hover:scale-125 transition-transform cursor-pointer"
                    title="Add plant emoji"
                  >
                    🌱
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-[#2C4A3E] hover:bg-[#587B6C] disabled:opacity-40 text-white transition-all shadow-sage cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center p-8 text-center bg-[#FAF8F5]">
            <div className="max-w-xs">
              <div className="w-16 h-16 rounded-3xl bg-[#E8EFEA] flex items-center justify-center mx-auto mb-3 text-[#587B6C]">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-base text-[#2C4A3E] mb-1">Your Direct Messages</h3>
              <p className="text-xs text-[#8C857B] leading-relaxed">
                Connect directly with fellow Pune environmental volunteers, plan cleanups, and coordinate community drives.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
