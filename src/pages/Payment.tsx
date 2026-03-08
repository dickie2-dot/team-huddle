import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, Check, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    // Placeholder payment
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => navigate("/locker-room"), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => navigate("/locker-room")}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h2 className="text-xl font-display font-bold text-foreground">
          Secure Your <span className="text-gradient-primary">Spot</span>
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-6 text-center space-y-4"
      >
        {success ? (
          <div className="space-y-3 py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Check className="w-16 h-16 text-primary mx-auto" />
            </motion.div>
            <p className="font-display font-bold text-foreground text-xl">Payment Confirmed</p>
            <p className="text-sm text-muted-foreground">You're in the squad! Redirecting...</p>
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
          </div>
        ) : (
          <>
            <CreditCard className="w-12 h-12 text-primary mx-auto" />
            <div>
              <p className="text-4xl font-display font-extrabold text-foreground">£6</p>
              <p className="text-sm text-muted-foreground mt-1">Match fee for this week</p>
            </div>

            <div className="space-y-2 text-left bg-secondary/30 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Match fee</span>
                <span className="font-semibold text-foreground">£6.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing</span>
                <span className="font-semibold text-foreground">£0.00</span>
              </div>
              <div className="border-t border-border/50 pt-2 flex justify-between text-sm">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-foreground">£6.00</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm justify-center">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full rounded-2xl font-display font-bold text-base py-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing…
                </span>
              ) : (
                "Pay & Confirm"
              )}
            </Button>

            <button
              onClick={() => navigate("/locker-room")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Payment;
