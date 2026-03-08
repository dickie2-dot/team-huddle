import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Bell,
  Clock,
  CreditCard,
  Banknote,
  Swords,
  UserMinus,
  FileText,
  Check,
  ChevronRight,
  Zap,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AutoCaptainSettings {
  autoInvite: boolean;
  autoReminders: boolean;
  reminderHoursBefore: number;
  paymentReminders: boolean;
  latePaymentFine: boolean;
  latePaymentFineAmount: number;
  autoDraft: boolean;
  dropoutNotify: boolean;
  matchRecap: boolean;
}

const DEFAULT_SETTINGS: AutoCaptainSettings = {
  autoInvite: true,
  autoReminders: true,
  reminderHoursBefore: 24,
  paymentReminders: true,
  latePaymentFine: false,
  latePaymentFineAmount: 2,
  autoDraft: true,
  dropoutNotify: true,
  matchRecap: true,
};

const AutoCaptain = () => {
  const [settings, setSettings] = useState<AutoCaptainSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof AutoCaptainSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const features = [
    {
      key: "autoInvite" as const,
      icon: Bell,
      title: "Auto Invite",
      desc: "Notify all club members when a match is created",
      active: settings.autoInvite,
    },
    {
      key: "autoReminders" as const,
      icon: Clock,
      title: "Auto Reminders",
      desc: `Remind unjoined players ${settings.reminderHoursBefore}h before kick-off`,
      active: settings.autoReminders,
    },
    {
      key: "paymentReminders" as const,
      icon: CreditCard,
      title: "Payment Reminders",
      desc: "Chase players who joined but haven't paid",
      active: settings.paymentReminders,
    },
    {
      key: "latePaymentFine" as const,
      icon: Banknote,
      title: "Late Payment Fine",
      desc: `Auto-fine £${settings.latePaymentFineAmount} for late payments → Social Kitty`,
      active: settings.latePaymentFine,
    },
    {
      key: "autoDraft" as const,
      icon: Swords,
      title: "Auto Draft",
      desc: "Generate teams automatically when the roster is full",
      active: settings.autoDraft,
    },
    {
      key: "dropoutNotify" as const,
      icon: UserMinus,
      title: "Dropout Replacement",
      desc: "Alert club members when a spot opens up",
      active: settings.dropoutNotify,
    },
    {
      key: "matchRecap" as const,
      icon: FileText,
      title: "Match Recap",
      desc: "Post a summary after each match to the club feed",
      active: settings.matchRecap,
    },
  ];

  const activeCount = features.filter((f) => f.active).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header Card */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground text-lg">Auto Captain</h2>
            <p className="text-[10px] text-muted-foreground font-medium">
              Automate common admin tasks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(activeCount / features.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
          <span className="text-[10px] font-bold text-primary tabular-nums">
            {activeCount}/{features.length}
          </span>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-2">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-elevated p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    feature.active ? "bg-primary/10" : "bg-secondary/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      feature.active ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{feature.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {feature.desc}
                  </p>
                </div>
                <Switch
                  checked={feature.active}
                  onCheckedChange={() => toggle(feature.key)}
                />
              </div>

              {/* Late Payment Fine amount config */}
              {feature.key === "latePaymentFine" && feature.active && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      Fine amount
                    </span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 5].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => {
                            setSettings((prev) => ({
                              ...prev,
                              latePaymentFineAmount: amt,
                            }));
                            setSaved(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            settings.latePaymentFineAmount === amt
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          £{amt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1.5">
                    Fine auto-added to Fines &amp; Social Kitty
                  </p>
                </motion.div>
              )}

              {/* Reminder timing config */}
              {feature.key === "autoReminders" && feature.active && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      Remind before
                    </span>
                    <div className="flex items-center gap-2">
                      {[6, 12, 24, 48].map((hrs) => (
                        <button
                          key={hrs}
                          onClick={() => {
                            setSettings((prev) => ({
                              ...prev,
                              reminderHoursBefore: hrs,
                            }));
                            setSaved(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            settings.reminderHoursBefore === hrs
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          {hrs}h
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        className={`w-full py-3 rounded-xl font-display font-bold text-sm transition-all ${
          saved
            ? "bg-primary/15 text-primary"
            : "bg-primary text-primary-foreground glow-primary"
        }`}
        whileTap={{ scale: 0.97 }}
      >
        {saved ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Settings Saved
          </span>
        ) : (
          "Save Auto Captain Settings"
        )}
      </motion.button>

      {/* How It Works */}
      <div className="card-elevated p-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          How Auto Captain Works
        </h4>
        <div className="space-y-2">
          {[
            { step: "1", text: "Admin creates a match with date, time, venue & fee" },
            { step: "2", text: "All members receive an invite to secure their spot" },
            { step: "3", text: "Reminders sent to those who haven't joined or paid" },
            { step: "4", text: "Late payment fines auto-added to Social Kitty" },
            { step: "5", text: "Teams drafted automatically when roster is full" },
            { step: "6", text: "Dropout? Club gets notified, spot opens up" },
            { step: "7", text: "Match recap posted to the feed after full time" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-primary">{item.step}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AutoCaptain;
