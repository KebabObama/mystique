"use client";

import { toast } from "@/components/layout/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Tabs from "@/components/ui/tabs";
import { authClient } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

/** Renders the auth page. */
export default () => {
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  return (
    <Card className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-6">
      <h1 className="bg-card px-2 pb-4 text-center text-2xl select-none">
        Authenticate To Join The Quest
      </h1>

      <Tabs defaultValue="login">
        <Tabs.List className="grid w-full grid-cols-2">
          <Tabs.Trigger value="login">Sign In</Tabs.Trigger>
          <Tabs.Trigger value="register">Sign Up</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="flex flex-col gap-4" value="login">
          <Login />
        </Tabs.Content>
        <Tabs.Content className="flex flex-col gap-4" value="register">
          <Register />
        </Tabs.Content>
      </Tabs>

      <div className="relative my-4 text-center">
        <div className="absolute inset-0 -mx-3 flex items-center">
          <span className="w-full border-t-6" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-lg select-none">Or continue with</span>
        </div>
      </div>

      <Google loading={googleLoading} setLoading={setGoogleLoading} />
    </Card>
  );
};

type Props = { loading: boolean; setLoading: (loading: boolean) => void };
type AuthActionState = { status: "idle" | "success" | "error"; message?: string };

const initialAuthActionState: AuthActionState = { status: "idle" };

const Google = ({ loading, setLoading }: Props) => {
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
      toast.show("Redirecting to Google...");
    } catch {
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="mb-0.5 w-full" disabled={loading} onClick={handleGoogleSignIn}>
      Google
    </Button>
  );
};

const Login = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    async (_previousState, formData) => {
      const email = formData.get("email")?.toString().trim() ?? "";
      const password = formData.get("password")?.toString() ?? "";
      const rememberMe = formData.get("rememberMe") === "on";

      try {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
          rememberMe,
        });
        if (result.error) return { status: "error", message: "Sign in failed" };
        return { status: "success", message: "Success!" };
      } catch {
        return { status: "error", message: "Sign in failed" };
      }
    },
    initialAuthActionState,
  );

  useEffect(() => {
    if (state.status === "error") {
      toast.error(state.message ?? "Sign in failed");
      return;
    }
    if (state.status === "success") {
      toast.show(state.message ?? "Success!");
      router.push("/dashboard");
    }
  }, [router, state]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor="login-email">Email</label>
      <Input
        disabled={pending}
        id="login-email"
        name="email"
        placeholder="Enter your email"
        required
        type="email"
      />
      <label htmlFor="login-password">Password</label>
      <Input
        disabled={pending}
        id="login-password"
        name="password"
        placeholder="Enter your password"
        required
        type="password"
      />
      <div className="mt-2 flex items-center gap-2">
        <input
          className="accent-primary ring-border ml-2.5 size-4 cursor-pointer bg-transparent ring-4 disabled:cursor-not-allowed"
          disabled={pending}
          id="remember-me"
          name="rememberMe"
          type="checkbox"
        />
        <label className="cursor-pointer text-sm select-none" htmlFor="remember-me">
          Remember me
        </label>
      </div>
      <Button className="mt-2 w-full" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

const Register = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    async (_previousState, formData) => {
      const name = formData.get("name")?.toString().trim() ?? "";
      const email = formData.get("email")?.toString().trim() ?? "";
      const password = formData.get("password")?.toString() ?? "";
      const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

      if (password !== confirmPassword) return { status: "error", message: "Passwords don't match" };
      if (password.length < 6) return { status: "error", message: "Password too short" };

      try {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/dashboard",
        });
        if (result.error) return { status: "error", message: "Registration failed" };
        return { status: "success", message: "Account created!" };
      } catch {
        return { status: "error", message: "Registration failed" };
      }
    },
    initialAuthActionState,
  );

  useEffect(() => {
    if (state.status === "error") {
      toast.error(state.message ?? "Registration failed");
      return;
    }
    if (state.status === "success") {
      toast.success(state.message ?? "Account created!");
      router.push("/dashboard");
    }
  }, [router, state]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor="register-name">Full Name</label>
      <Input
        disabled={pending}
        id="register-name"
        name="name"
        placeholder="Enter your full name"
        required
        type="text"
      />
      <label htmlFor="register-email">Email</label>
      <Input
        disabled={pending}
        id="register-email"
        name="email"
        placeholder="Enter your email"
        required
        type="email"
      />
      <label htmlFor="register-password">Password</label>
      <Input
        disabled={pending}
        id="register-password"
        minLength={6}
        name="password"
        placeholder="Create a password (min. 6 characters)"
        required
        type="password"
      />
      <label htmlFor="register-confirm-password">Confirm Password</label>
      <Input
        disabled={pending}
        id="register-confirm-password"
        name="confirmPassword"
        placeholder="Confirm your password"
        required
        type="password"
      />
      <Button className="mt-3 w-full" disabled={pending} type="submit">
        {pending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};
