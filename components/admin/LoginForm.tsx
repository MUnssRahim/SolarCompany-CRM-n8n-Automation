"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { LockIcon, MailIcon, ShieldCheckIcon, SunIcon } from "@/components/ui/icons";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-brand-400">
            <SunIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Solaris Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Engineering Operations Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="pl-9"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="mb-1.5">
                Password
              </Label>
              <a href="#" className="mb-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="pl-9"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </Button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
          Secure connection established.
        </p>
      </div>
    </div>
  );
}
