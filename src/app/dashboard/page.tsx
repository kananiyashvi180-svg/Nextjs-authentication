import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Force dynamic rendering — this page reads cookies at request time
export const dynamic = "force-dynamic";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import Sidebar from "@/components/Sidebar";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Bell,
  Search,
} from "lucide-react";

// ─── Server Component – Auth-protected ───────────────────────────────────────
export default async function DashboardPage() {
  // 1. Read token from HTTP-only cookie (server-side only)
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  // 2. Verify JWT
  const decoded = verifyToken(token);
  if (!decoded) {
    redirect("/login");
  }

  // 3. Fetch authenticated user from MongoDB
  await connectDB();
  const user = await User.findById(decoded.userId).select("-password").lean();

  if (!user) {
    redirect("/login");
  }

  // Safe serialization for client props
  const safeUser = {
    id: (user._id as { toString(): string }).toString(),
    name: user.name as string,
    email: user.email as string,
    createdAt: (user.createdAt as Date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  // ─── Static dashboard data ────────────────────────────────────────────────
  const stats = [
    { title: "Total Revenue", value: "$24,580", change: "+12.5%", positive: true, Icon: TrendingUp, description: "vs last month" },
    { title: "Total Users", value: "1,248", change: "+8.2%", positive: true, Icon: Users, description: "vs last month" },
    { title: "Total Orders", value: "856", change: "-3.4%", positive: false, Icon: ShoppingBag, description: "vs last month" },
    { title: "Growth Rate", value: "18.6%", change: "+4.1%", positive: true, Icon: TrendingUp, description: "vs last month" },
  ];

  const activities = [
    { title: "New user registered", description: "A new account was created", time: "5 minutes ago", color: "bg-blue-500" },
    { title: "New order received", description: "Order #ORD-1024 was placed", time: "25 minutes ago", color: "bg-green-500" },
    { title: "Payment completed", description: "Payment of $240.00 received", time: "1 hour ago", color: "bg-purple-500" },
    { title: "Product updated", description: "Inventory was updated", time: "3 hours ago", color: "bg-orange-500" },
  ];

  // Initials from name
  const initials = safeUser.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ── Sidebar (client component for logout) ─────────────────────────── */}
      <Sidebar user={safeUser} />

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="lg:ml-64">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 md:px-10">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, {safeUser.name}! Here&apos;s what&apos;s happening today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-lg border p-2 text-gray-500 hover:bg-gray-50">
              <Search size={20} />
            </button>
            <button className="relative rounded-lg border p-2 text-gray-500 hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{safeUser.name}</p>
                <p className="text-xs text-gray-500">{safeUser.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-10">
          {/* Welcome Banner */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h2 className="text-2xl font-bold">
              Good day, {safeUser.name}! 👋
            </h2>
            <p className="mt-2 text-indigo-100">
              Here&apos;s a quick overview of your dashboard.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 text-sm">
              <span>Member since</span>
              <span className="font-semibold">{safeUser.createdAt}</span>
            </div>
          </div>

          {/* User Info Card */}
          <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Your Profile</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                {initials}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900">{safeUser.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Email Address</p>
                  <p className="font-medium text-gray-900">{safeUser.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Account ID</p>
                  <p className="font-mono text-xs text-gray-500">{safeUser.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Member Since</p>
                  <p className="font-medium text-gray-900">{safeUser.createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.title} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <stat.Icon size={20} />
                  </div>
                </div>
                <h3 className="mt-4 text-2xl font-bold">{stat.value}</h3>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  {stat.positive ? (
                    <ArrowUpRight size={16} className="text-green-600" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-600" />
                  )}
                  <span className={stat.positive ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400">{stat.description}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <section className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <button className="text-sm font-medium text-indigo-600 hover:underline">
                  View all
                </button>
              </div>
              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className={`h-3 w-3 rounded-full ${activity.color} mt-1.5`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <footer className="mt-10 text-center text-sm text-gray-400">
            © 2026 DashFlow. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
