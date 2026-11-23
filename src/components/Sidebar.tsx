"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  User,
  Settings,
  Home,
  Loader2,
} from "lucide-react";

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // Initials from name
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "#profile", label: "Profile", Icon: User },
    { href: "#settings", label: "Settings", Icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-white lg:flex">
      {/* ── App Name ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="rounded-xl bg-indigo-600 p-2 text-white">
          <LayoutDashboard size={22} />
        </div>
        <span className="text-xl font-bold text-gray-900">DashFlow</span>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {navLinks.map(({ href, label, Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-700 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-700"
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}

        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <Home size={20} />
          Home
        </Link>
      </nav>

      {/* ── Profile + Logout ──────────────────────────────────────────────── */}
      <div className="border-t px-4 py-4">
        {/* User info */}
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
