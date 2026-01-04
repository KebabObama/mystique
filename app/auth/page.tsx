"use client";

import { toast } from "@/components/layout/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Tabs from "@/components/ui/tabs";
import { authClient } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Card className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-6">
      <div className="grid grid-cols-2 gap-6">
        <Github loading={loading} setLoading={setLoading} />
        <Google loading={loading} setLoading={setLoading} />
      </div>

      <div className="relative text-center my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="text-muted px-2 select-none">Or continue with</span>
        </div>
      </div>

      <Tabs defaultValue="login">
        <Tabs.List className="grid w-full grid-cols-2">
          <Tabs.Trigger value="login">Sign In</Tabs.Trigger>
          <Tabs.Trigger value="register">Sign Up</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="flex flex-col gap-4" value="login">
          <Login loading={loading} setLoading={setLoading} />
        </Tabs.Content>
        <Tabs.Content className="flex flex-col gap-4" value="register">
          <Register loading={loading} setLoading={setLoading} />
        </Tabs.Content>
      </Tabs>
    </Card>
  );
};

type Props = { loading: boolean; setLoading: (loading: boolean) => void };

const Google = ({ loading, setLoading }: Props) => {
  return (
    <Button
      className="w-full"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
          toast.show("Redirecting to Google...");
        } catch (error) {
          console.error("Google auth error:", error);
          toast.error("Authentication failed");
        } finally {
          setLoading(false);
        }
      }}
      variant="outline"
    >
      Google
    </Button>
  );
};

const Github = ({ loading, setLoading }: Props) => {
  return (
    <Button
      className="w-full"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" });
          toast.show("Redirecting to Github...");
        } catch (error) {
          console.error("GitHub auth error:", error);
          toast.error("Authentication failed");
        } finally {
          setLoading(false);
        }
      }}
      variant="outline"
    >
      GitHub
    </Button>
  );
};

const Login = ({ loading, setLoading }: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe,
      });

      if (result.error) toast.error("Sign in failed");
      else {
        toast.show("Success!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleLogin}>
      <label htmlFor="login-email">Email</label>
      <Input
        disabled={loading}
        id="login-email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        type="email"
        value={email}
      />
      <label htmlFor="login-password">Password</label>
      <Input
        disabled={loading}
        id="login-password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        type="password"
        value={password}
      />
      <div className="flex items-center gap-2">
        <input
          checked={rememberMe}
          className="accent-primary size-4 cursor-pointer border-4 bg-transparent disabled:cursor-not-allowed"
          disabled={loading}
          id="remember-me"
          onChange={(e) => setRememberMe(e.target.checked)}
          type="checkbox"
        />
        <label className="cursor-pointer text-sm select-none" htmlFor="remember-me">
          Remember me
        </label>
      </div>
      <Button className="mt-2 w-full" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

const Register = ({ loading, setLoading }: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password too short");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        toast.error("Registration failed");
      } else {
        toast.success("Account created!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleRegister}>
      <label htmlFor="register-name">Full Name</label>
      <Input
        disabled={loading}
        id="register-name"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your full name"
        required
        type="text"
        value={name}
      />
      <label htmlFor="register-email">Email</label>
      <Input
        disabled={loading}
        id="register-email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        type="email"
        value={email}
      />
      <label htmlFor="register-password">Password</label>
      <Input
        disabled={loading}
        id="register-password"
        minLength={6}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password (min. 6 characters)"
        required
        type="password"
        value={password}
      />
      <label htmlFor="register-confirm-password">Confirm Password</label>
      <Input
        disabled={loading}
        id="register-confirm-password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        required
        type="password"
        value={confirmPassword}
      />
      <Button className="mt-2 w-full" disabled={loading} type="submit">
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};
