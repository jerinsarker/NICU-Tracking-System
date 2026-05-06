import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Eye, EyeOff, Phone, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ForgotStep = "phone" | "otp" | "reset";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [step, setStep] = useState<ForgotStep>("phone");
  const [fpPhone, setFpPhone] = useState("+880");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [resending, setResending] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const resetForgotState = () => {
    setStep("phone");
    setFpPhone("+880");
    setOtp("");
    setNewPass("");
    setConfirmPass("");
    setShowNew(false);
  };

  const openForgot = () => {
    resetForgotState();
    setForgotOpen(true);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = fpPhone.replace(/\D/g, "");
    if (digits.length < 11) {
      toast({ title: "Invalid phone", description: "Enter a valid phone number with country code.", variant: "destructive" });
      return;
    }
    toast({ title: "OTP sent", description: `A 6-digit code was sent to ${fpPhone}` });
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter the 6-digit code.", variant: "destructive" });
      return;
    }
    toast({ title: "Verified", description: "Phone number verified successfully." });
    setStep("reset");
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      toast({ title: "OTP resent", description: `A new code was sent to ${fpPhone}` });
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) {
      toast({ title: "Weak password", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (newPass !== confirmPass) {
      toast({ title: "Mismatch", description: "New password and confirm password do not match.", variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "You can now log in with your new password." });
    setForgotOpen(false);
    resetForgotState();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">
                Nationwide Real-Time NICU
              </h1>
              <p className="text-lg font-semibold text-primary">
                Bed Occupancy & Vacancy Tracking
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address or Phone Number</Label>
                <Input
                  id="email"
                  placeholder="admin@nicu.gov.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={openForgot}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={(o) => { setForgotOpen(o); if (!o) resetForgotState(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {step === "phone" && <Phone className="h-5 w-5 text-primary" />}
              {step === "otp" && <ShieldCheck className="h-5 w-5 text-primary" />}
              {step === "reset" && <KeyRound className="h-5 w-5 text-primary" />}
            </div>
            <DialogTitle className="text-center">
              {step === "phone" && "Reset your password"}
              {step === "otp" && "Verify your phone"}
              {step === "reset" && "Set a new password"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {step === "phone" && "Enter your registered phone number. We'll send a 6-digit OTP to verify."}
              {step === "otp" && `We sent a 6-digit code to ${fpPhone}. Enter it below to continue.`}
              {step === "reset" && "Choose a strong password you haven't used before."}
            </DialogDescription>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 py-1">
            {(["phone", "otp", "reset"] as ForgotStep[]).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 w-10 rounded-full transition-colors ${
                  step === s
                    ? "bg-primary"
                    : i < ["phone", "otp", "reset"].indexOf(step)
                    ? "bg-primary/60"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fp-phone">Phone Number</Label>
                <Input
                  id="fp-phone"
                  type="tel"
                  placeholder="+8801XXXXXXXXX"
                  value={fpPhone}
                  onChange={(e) => setFpPhone(e.target.value)}
                  className="h-11"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Use the phone number linked to your account.
                </p>
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send OTP</Button>
              </DialogFooter>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fp-otp">6-digit OTP</Label>
                <Input
                  id="fp-otp"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-11 text-center tracking-[0.5em] text-lg"
                  autoFocus
                />
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" /> Change number
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="font-medium text-primary hover:underline disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Verify</Button>
              </DialogFooter>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fp-new">New Password</Label>
                <div className="relative">
                  <Input
                    id="fp-new"
                    type={showNew ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fp-confirm">Confirm New Password</Label>
                <Input
                  id="fp-confirm"
                  type={showNew ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="h-11"
                />
                {confirmPass.length > 0 && confirmPass !== newPass && (
                  <p className="text-xs text-destructive">Passwords do not match.</p>
                )}
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Password</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
