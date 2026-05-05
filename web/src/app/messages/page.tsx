'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  MessageSquare, Search, Send, Plus, Users, Loader2, X,
  User as UserIcon, Circle, ArrowLeft, Mail
} from 'lucide-react';
import { useMessageStore } from '@/store/message.store';
import { useAuthStore } from '@/store/auth.store';
import { useSocket } from '@/hooks/useSocket';
import { clsx } from 'clsx';
import { formatDistanceToNow, format, isToday } from 'date-fns';

export default function MessagesPage() {
  const {
    conversations, messages, contacts, activeConversationId, loading,
    fetchConversations, fetchMessages, fetchContacts, sendMessage,
    setActiveConversation, fetchUnreadCount
  } = useMessageStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useSocket();

  useEffect(() => {
    fetchConversations();
    fetchContacts();
    fetchUnreadCount();
  }, [fetchConversations, fetchContacts, fetchUnreadCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConv = conversations.find(c => c.conversationId === activeConversationId);

  const handleSelectConversation = (convId: string) => {
    fetchMessages(convId);
    setMobileShowThread(true);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeConv) return;
    await sendMessage(activeConv.participant.id, input.trim());
    setInput('');
  };

  const handleNewConversation = async (contactId: string) => {
    setShowContacts(false);
    // Build the conversation ID deterministically
    if (!user) return;
    const convId = [user.id, contactId].sort().join('-');
    setActiveConversation(convId);
    fetchMessages(convId);
    setMobileShowThread(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.participant?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatMsgTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return format(d, 'HH:mm');
    return formatDistanceToNow(d, { addSuffix: false }).replace('about ', '');
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-status-error/20 text-status-error border-status-error/30';
      case 'PM': return 'bg-primary/20 text-primary border-primary/30';
      case 'TENANT': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default: return 'bg-white/10 text-white/40 border-white/10';
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Communications Hub</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Unified Messaging • Real-Time Sync</p>
          </div>
          <button
            onClick={() => { fetchContacts(); setShowContacts(true); }}
            className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
          >
            <Plus className="w-5 h-5" /> New Thread
          </button>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex bg-surface/30 border border-white/[0.03] rounded-[3rem] overflow-hidden backdrop-blur-md min-h-0">

          {/* Conversation List */}
          <div className={clsx(
            "w-full lg:w-96 border-r border-white/[0.03] flex flex-col shrink-0",
            mobileShowThread ? "hidden lg:flex" : "flex"
          )}>
            {/* Search */}
            <div className="p-5 border-b border-white/[0.03]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3.5 pl-12 pr-5 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-10 px-8">
                  <MessageSquare className="w-12 h-12 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic text-center">No conversations yet</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest mt-1 text-center">Start a new thread to begin</p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <button
                    key={conv.conversationId}
                    onClick={() => handleSelectConversation(conv.conversationId)}
                    className={clsx(
                      "w-full p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-all border-b border-white/[0.01] text-left group",
                      activeConversationId === conv.conversationId && "bg-primary/[0.03] border-l-2 border-l-primary"
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-white/30 group-hover:border-primary/20 transition-all overflow-hidden">
                        {conv.participant?.avatar ? (
                          <img src={conv.participant.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-xs font-black italic">{getInitials(conv.participant?.name)}</span>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                          <span className="text-[8px] font-black text-white">{conv.unreadCount}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-black text-white italic uppercase tracking-tighter truncate">{conv.participant?.name}</p>
                        <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest shrink-0 ml-2">
                          {conv.lastMessage && formatMsgTime(conv.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/20 font-bold italic truncate leading-relaxed">
                        {conv.lastMessage?.senderId === user?.id && <span className="text-white/30">You: </span>}
                        {conv.lastMessage?.content}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className={clsx(
            "flex-1 flex flex-col min-w-0",
            !mobileShowThread ? "hidden lg:flex" : "flex"
          )}>
            {!activeConversationId ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                <Mail className="w-16 h-16 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Select a conversation</p>
                <p className="text-[8px] font-bold uppercase tracking-widest mt-2">Or start a new thread</p>
              </div>
            ) : (
              <>
                {/* Thread Header */}
                <div className="p-5 border-b border-white/[0.03] flex items-center gap-4">
                  <button
                    onClick={() => { setMobileShowThread(false); setActiveConversation(null); }}
                    className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-white/30"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-white/30 overflow-hidden">
                    {activeConv?.participant?.avatar ? (
                      <img src={activeConv.participant.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="text-[10px] font-black italic">{getInitials(activeConv?.participant?.name)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white italic uppercase tracking-tighter">{activeConv?.participant?.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={clsx("px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest italic border", getRoleBadgeColor(activeConv?.participant?.role))}>
                        {activeConv?.participant?.role}
                      </span>
                      <span className="text-[8px] text-white/10 font-bold italic lowercase">{activeConv?.participant?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20">
                      <Loader2 className="w-8 h-8 animate-spin mb-4" />
                      <p className="text-[9px] font-black uppercase tracking-widest italic">Loading thread...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-10">
                      <MessageSquare className="w-12 h-12 mb-4" />
                      <p className="text-[9px] font-black uppercase tracking-widest italic">No messages yet</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest mt-1">Send the first message below</p>
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMine = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={clsx("flex", isMine ? "justify-end" : "justify-start")}>
                          <div className={clsx(
                            "max-w-[75%] rounded-[1.5rem] px-5 py-3.5 relative group",
                            isMine
                              ? "bg-primary/20 border border-primary/20 rounded-br-lg"
                              : "bg-white/[0.03] border border-white/[0.05] rounded-bl-lg"
                          )}>
                            <p className="text-xs font-bold text-white/80 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <p className={clsx(
                              "text-[8px] font-bold uppercase tracking-widest mt-2",
                              isMine ? "text-primary/40 text-right" : "text-white/10"
                            )}>
                              {format(new Date(msg.createdAt), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-5 border-t border-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      rows={1}
                      className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3.5 px-5 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white hover:brightness-110 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-20 disabled:shadow-none shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* New Conversation Modal */}
      {showContacts && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setShowContacts(false)}>
          <div className="bg-surface border border-white/[0.05] rounded-[2.5rem] w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">New Conversation</h3>
              </div>
              <button onClick={() => setShowContacts(false)} className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {contacts.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center opacity-10">
                  <Users className="w-10 h-10 mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest italic">No contacts found</p>
                </div>
              ) : (
                contacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => handleNewConversation(contact.id)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-white/[0.03] rounded-2xl transition-all group text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-white/20 group-hover:border-primary/20 transition-all overflow-hidden shrink-0">
                      {contact.avatar ? (
                        <img src={contact.avatar} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="text-[10px] font-black italic">{getInitials(contact.name)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{contact.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={clsx("px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest italic border", getRoleBadgeColor(contact.role))}>
                          {contact.role}
                        </span>
                        <span className="text-[8px] text-white/10 font-bold italic lowercase truncate">{contact.email}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
