import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Send,
  BarChart3,
  MessageCircle,
  Check,
  Loader2,
  Smile,
  AlertCircle,
} from "lucide-react";
import { DUMMY_MESSAGES, DUMMY_POLLS } from "@/data/dummy-data";

interface Message {
  id: string;
  user_id: string;
  user_name?: string;
  user_initials?: string;
  content: string;
  created_at: string;
  profile?: { display_name: string | null; avatar_url: string | null };
  reactions?: { emoji: string; count: number; reacted: boolean }[];
}

interface Poll {
  id: string;
  question: string;
  is_active: boolean;
  created_at: string;
  options: { id: string; label: string; vote_count: number }[];
  user_vote?: string;
}

const REACTION_EMOJIS = ["👍", "😂", "🔥", "❤️", "😢", "🙏"];

const ChatPoll = () => {
  const [tab, setTab] = useState<"chat" | "polls">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(2);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      await loadMessages();
      await loadPolls();

      // Realtime subscription
      const channel = supabase
        .channel("chat-messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          async (payload) => {
            const newMsg = payload.new as any;
            const { data: profile } = await supabase
              .from("profiles")
              .select("display_name, avatar_url")
              .eq("user_id", newMsg.user_id)
              .maybeSingle();

            setMessages((prev) => [
              ...prev,
              { ...newMsg, profile: profile || undefined },
            ]);
          }
        )
        .subscribe();

      // Fake typing indicator
      const typingInterval = setInterval(() => {
        const names = ["Jake", "Leo", "Sam"];
        const shouldShow = Math.random() > 0.7;
        setTypingUsers(shouldShow ? [names[Math.floor(Math.random() * names.length)]] : []);
      }, 4000);

      setLoading(false);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(typingInterval);
      };
    } catch {
      setError("Failed to load chat. Showing offline data.");
      // Fallback to dummy data
      setMessages(
        DUMMY_MESSAGES.map((m) => ({
          id: m.id,
          user_id: m.user_initials,
          user_name: m.user_name,
          user_initials: m.user_initials,
          content: m.content,
          created_at: m.created_at,
          reactions: m.reactions,
        }))
      );
      setPolls(
        DUMMY_POLLS.map((p) => ({ ...p, is_active: true, created_at: new Date().toISOString() }))
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100);

    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      const enriched = data.map((msg) => ({
        ...msg,
        profile: profiles?.find((p) => p.user_id === msg.user_id),
      }));
      setMessages(enriched);
    } else {
      // Use dummy messages as fallback
      setMessages(
        DUMMY_MESSAGES.map((m) => ({
          id: m.id,
          user_id: m.user_initials,
          user_name: m.user_name,
          user_initials: m.user_initials,
          content: m.content,
          created_at: m.created_at,
          reactions: m.reactions,
        }))
      );
    }
  };

  const loadPolls = async () => {
    const { data: pollsData } = await supabase
      .from("polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!pollsData || pollsData.length === 0) {
      setPolls(DUMMY_POLLS.map((p) => ({ ...p, is_active: true, created_at: new Date().toISOString() })));
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const enrichedPolls: Poll[] = [];

    for (const poll of pollsData) {
      const { data: options } = await supabase
        .from("poll_options")
        .select("id, label, sort_order")
        .eq("poll_id", poll.id)
        .order("sort_order");

      const { data: votes } = await supabase
        .from("poll_votes")
        .select("option_id, user_id")
        .eq("poll_id", poll.id);

      const optionsWithCounts = (options || []).map((opt) => ({
        ...opt,
        vote_count: (votes || []).filter((v) => v.option_id === opt.id).length,
      }));

      const userVote = user
        ? (votes || []).find((v) => v.user_id === user.id)?.option_id
        : undefined;

      enrichedPolls.push({
        id: poll.id,
        question: poll.question,
        is_active: poll.is_active,
        created_at: poll.created_at,
        options: optionsWithCounts,
        user_vote: userVote,
      });
    }

    setPolls(enrichedPolls);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Offline mode — add dummy message
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          user_id: "me",
          user_name: "You",
          user_initials: "ME",
          content: newMessage.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
      setSending(false);
      return;
    }

    await supabase.from("messages").insert({
      user_id: user.id,
      content: newMessage.trim(),
    });

    setNewMessage("");
    setSending(false);
  };

  const vote = async (pollId: string, optionId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Offline vote
      setPolls((prev) =>
        prev.map((p) =>
          p.id === pollId ? { ...p, user_vote: optionId } : p
        )
      );
      return;
    }

    await supabase
      .from("poll_votes")
      .delete()
      .eq("poll_id", pollId)
      .eq("user_id", user.id);

    await supabase.from("poll_votes").insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id,
    });

    await loadPolls();
  };

  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        const reactions = msg.reactions || [];
        const existing = reactions.find((r) => r.emoji === emoji);
        if (existing) {
          return {
            ...msg,
            reactions: existing.reacted
              ? reactions.filter((r) => r.emoji !== emoji || r.count > 1).map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count - 1, reacted: false } : r
                )
              : reactions.map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r
                ),
          };
        }
        return {
          ...msg,
          reactions: [...reactions, { emoji, count: 1, reacted: true }],
        };
      })
    );
    setShowReactionPicker(null);
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Group messages by sender for consecutive messages
  const shouldShowHeader = (msg: Message, i: number) => {
    if (i === 0) return true;
    const prev = messages[i - 1];
    const userId = msg.user_id;
    const prevUserId = prev.user_id;
    if (userId !== prevUserId) return true;
    // Show header if more than 5 minutes apart
    const timeDiff = new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime();
    return timeDiff > 5 * 60 * 1000;
  };

  // Date separators
  const shouldShowDate = (msg: Message, i: number) => {
    if (i === 0) return true;
    const prev = messages[i - 1];
    return new Date(msg.created_at).toDateString() !== new Date(prev.created_at).toDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab switch */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("chat")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center ${
            tab === "chat"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => { setTab("polls"); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center relative ${
            tab === "polls"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Polls
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {tab === "chat" ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            <div className="card-elevated rounded-2xl overflow-hidden">
              <div className="h-[380px] overflow-y-auto p-4 space-y-1">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                    <MessageCircle className="w-10 h-10 opacity-30" />
                    <p className="text-sm">No messages yet. Start the chat!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.user_id === currentUserId || msg.user_id === "me";
                    const showHeader = shouldShowHeader(msg, i);
                    const showDate = shouldShowDate(msg, i);
                    const displayName = msg.user_name || msg.profile?.display_name || "Unknown";

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-3">
                            <span className="text-[10px] font-semibold text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""} ${
                            showHeader ? "mt-3" : "mt-0.5"
                          }`}
                        >
                          {/* Avatar — only show on first in group */}
                          {showHeader ? (
                            msg.profile?.avatar_url ? (
                              <img
                                src={msg.profile.avatar_url}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                {msg.user_initials || getInitials(displayName)}
                              </div>
                            )
                          ) : (
                            <div className="w-8 shrink-0" />
                          )}
                          <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                            {showHeader && (
                              <p className="text-[10px] font-semibold text-muted-foreground mb-0.5 px-1">
                                {displayName}
                              </p>
                            )}
                            <div
                              className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed relative group ${
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-secondary/70 text-foreground rounded-bl-md"
                              }`}
                            >
                              {msg.content}
                              {/* Reaction button */}
                              <button
                                onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                                className="absolute -bottom-2 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded-full p-0.5 shadow-sm"
                              >
                                <Smile className="w-3 h-3 text-muted-foreground" />
                              </button>
                            </div>

                            {/* Reactions */}
                            {msg.reactions && msg.reactions.length > 0 && (
                              <div className={`flex gap-1 mt-1 px-1 ${isMe ? "justify-end" : ""}`}>
                                {msg.reactions.map((r) => (
                                  <button
                                    key={r.emoji}
                                    onClick={() => toggleReaction(msg.id, r.emoji)}
                                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] border transition-colors ${
                                      r.reacted
                                        ? "bg-primary/10 border-primary/20 text-primary"
                                        : "bg-secondary/50 border-border text-muted-foreground hover:bg-secondary"
                                    }`}
                                  >
                                    {r.emoji} {r.count}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Reaction picker */}
                            <AnimatePresence>
                              {showReactionPicker === msg.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className={`flex gap-1 mt-1 bg-card border border-border rounded-full px-2 py-1 shadow-md ${
                                    isMe ? "justify-end" : ""
                                  }`}
                                >
                                  {REACTION_EMOJIS.map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => toggleReaction(msg.id, emoji)}
                                      className="text-base hover:scale-125 transition-transform p-0.5"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <p className="text-[9px] text-muted-foreground mt-0.5 px-1">
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })
                )}

                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5 mt-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {typingUsers[0]?.[0]}
                      </span>
                    </div>
                    <div className="bg-secondary/70 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-secondary/50 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
                  whileTap={{ scale: 0.9 }}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="polls"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {polls.length === 0 ? (
              <div className="card-elevated p-8 text-center space-y-2">
                <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  No active polls. Admins can create them from the dashboard.
                </p>
              </div>
            ) : (
              polls.map((poll) => {
                const totalVotes = poll.options.reduce((s, o) => s + o.vote_count, 0);
                return (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-elevated p-5 space-y-3"
                  >
                    <h3 className="font-display font-bold text-foreground">
                      {poll.question}
                    </h3>
                    <div className="space-y-2">
                      {poll.options.map((opt) => {
                        const pct = totalVotes > 0 ? (opt.vote_count / totalVotes) * 100 : 0;
                        const isVoted = poll.user_vote === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => vote(poll.id, opt.id)}
                            className={`w-full relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                              isVoted
                                ? "border-primary/40 bg-primary/5"
                                : "border-border hover:border-primary/20 hover:bg-secondary/30"
                            }`}
                          >
                            <div
                              className="absolute inset-0 bg-primary/10 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                            <div className="relative flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                {isVoted && <Check className="w-3.5 h-3.5 text-primary" />}
                                {opt.label}
                              </span>
                              <span className="text-xs font-semibold text-muted-foreground">
                                {totalVotes > 0 ? `${Math.round(pct)}%` : "0%"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">
                      {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                    </p>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPoll;
