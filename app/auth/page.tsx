"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/layout/toast";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Tabs from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";

export default function AuthPage() {
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<Card className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
			<Card.Header>
				<Card.Title>Welcome</Card.Title>
				<Card.Description>
					Sign in to your account or create a new one
				</Card.Description>
			</Card.Header>
			<Card.Content className="flex flex-col gap-6">
				<div className="grid grid-cols-2 gap-4">
					<Github loading={loading} setLoading={setLoading} />
					<Google loading={loading} setLoading={setLoading} />
				</div>

				<div className="relative text-center">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="select-none px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>

				<Tabs defaultValue="login">
					<Tabs.List className="grid w-full grid-cols-2">
						<Tabs.Trigger value="login">Sign In</Tabs.Trigger>
						<Tabs.Trigger value="register">Sign Up</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="login" className="flex flex-col gap-4">
						<Login loading={loading} setLoading={setLoading} />
					</Tabs.Content>
					<Tabs.Content value="register" className="flex flex-col gap-4">
						<Register loading={loading} setLoading={setLoading} />
					</Tabs.Content>
				</Tabs>
			</Card.Content>
		</Card>
	);
}

type Props = {
	loading: boolean;
	setLoading: (loading: boolean) => void;
};

const Google = ({ loading, setLoading }: Props) => {
	return (
		<Button
			variant="outline"
			onClick={async () => {
				setLoading(true);
				try {
					await authClient.signIn.social({
						provider: "google",
						callbackURL: "/dashboard",
					});
					toast("Redirecting to Google...");
				} catch (error) {
					console.error("Google auth error:", error);
					toast.error("Authentication failed");
				} finally {
					setLoading(false);
				}
			}}
			disabled={loading}
			className="w-full"
		>
			Google
		</Button>
	);
};

const Github = ({ loading, setLoading }: Props) => {
	return (
		<Button
			variant="outline"
			onClick={async () => {
				setLoading(true);
				try {
					await authClient.signIn.social({
						provider: "github",
						callbackURL: "/dashboard",
					});
					toast("Redirecting to Github...");
				} catch (error) {
					console.error("GitHub auth error:", error);
					toast.error("Authentication failed");
				} finally {
					setLoading(false);
				}
			}}
			disabled={loading}
			className="w-full"
		>
			GitHub
		</Button>
	);
};

const Login = ({ loading, setLoading }: Props) => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await authClient.signIn.email({
				email,
				password,
				callbackURL: "/dashboard",
			});

			if (result.error) toast.error("Sign in failed");
			else {
				toast("Success!");
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
		<form onSubmit={handleLogin} className="flex flex-col gap-3">
			<label htmlFor="login-email">Email</label>
			<Input
				id="login-email"
				type="email"
				placeholder="Enter your email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				disabled={loading}
			/>
			<label htmlFor="login-password">Password</label>
			<Input
				id="login-password"
				type="password"
				placeholder="Enter your password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				disabled={loading}
			/>
			<Button type="submit" disabled={loading} className="mt-2 w-full">
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
		<form onSubmit={handleRegister} className="flex flex-col gap-3">
			<label htmlFor="register-name">Full Name</label>
			<Input
				id="register-name"
				type="text"
				placeholder="Enter your full name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
				disabled={loading}
			/>
			<label htmlFor="register-email">Email</label>
			<Input
				id="register-email"
				type="email"
				placeholder="Enter your email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				disabled={loading}
			/>
			<label htmlFor="register-password">Password</label>
			<Input
				id="register-password"
				type="password"
				placeholder="Create a password (min. 6 characters)"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				disabled={loading}
				minLength={6}
			/>
			<label htmlFor="register-confirm-password">Confirm Password</label>
			<Input
				id="register-confirm-password"
				type="password"
				placeholder="Confirm your password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				required
				disabled={loading}
			/>
			<Button type="submit" disabled={loading} className="mt-2 w-full">
				{loading ? "Creating account..." : "Create Account"}
			</Button>
		</form>
	);
};
