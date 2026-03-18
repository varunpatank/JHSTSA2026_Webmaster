"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

interface AuthRequiredNoticeProps {
  title?: string;
  message: string;
  redirectTo: string;
  loginLabel?: string;
}

export default function AuthRequiredNotice({
  title = "Please Sign In",
  message,
  redirectTo,
  loginLabel = "Go to Login",
}: AuthRequiredNoticeProps) {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="card p-8 max-w-xl w-full text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
          <Lock size={24} />
        </div>
        <h1 className="text-2xl font-heading font-bold text-primary-600">
          {title}
        </h1>
        <p className="mt-2 text-neutral-700">{message}</p>
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="btn-primary inline-block mt-5"
        >
          {loginLabel}
        </Link>
      </div>
    </div>
  );
}
