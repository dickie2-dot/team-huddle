import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Send,
  BarChart3,
  MessageCircle,
  Check,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: { display_name: string | null; avatar_url: string | null };
}

interface Poll {
  id: string;
  question: string;
  is_active: boolean;
  created_at: string;
  options: { id: string; label: string; vote_count: number }[];
  user_vote?: string;
}

const ChatPoll = () => {
  const [tab, setTab] = useState<"chat" | "polls">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
    loadMessages();
    loadPolls();

    // Realtime subscription for messages
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const newMsg = payload.new as any;
          // Fetch profile for the new message
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      // Fetch profiles for all message authors
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
    }
  };

  const loadPolls = async () => {
    const { data: pollsData } = await supabase
      .from("polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!pollsData) return;

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
    if (!user) return;

    // Remove existing vote first
    await supabase
      .from("poll_votes")
      .delete()
      .eq("poll_id", pollId)
      .eq("user_id", user.id);

    // Cast new vote
    await supabase.from("poll_votes").insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id,
    });

    await loadPolls();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
          onClick={() => setTab("polls")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center ${
            tab === "polls"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Polls
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "chat" ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            {/* Messages */}
            <div className="card-elevated rounded-2xl overflow-hidden">
              <div className="h-[360px] overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                    <MessageCircle className="w-10 h-10 opacity-30" />
                    <p className="text-sm">No messages yet. Start the chat!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.user_id === currentUserId;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
                      >
                        {/* Avatar */}
                        {msg.profile?.avatar_url ? (
                          <img
                            src={msg.profile.avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                            {getInitials(msg.profile?.display_name)}
                          </div>
                        )}
                        <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                          <p className="text-[10px] font-semibold text-muted-foreground mb-0.5 px-1">
                            {msg.profile?.display_name || "Unknown"}
                          </p>
                          <div
                            className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-secondary/70 text-foreground rounded-bl-md"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[9px] text-muted-foreground mt-0.5 px-1">
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
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
                  No active polls. Admins can create them from the admin panel.
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
                            {/* Progress bar bg */}
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
