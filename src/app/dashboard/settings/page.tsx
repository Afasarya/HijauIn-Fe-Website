import { Settings as SettingsIcon, User, Bell, Lock, Globe, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage your admin panel settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <div className="rounded-xl border border-white/10 bg-[#171717] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <User className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <Input
                type="text"
                defaultValue="Admin User"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                defaultValue="admin@hijauin.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <Input
                type="tel"
                defaultValue="+62 812 3456 7890"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-xl border border-white/10 bg-[#171717] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Lock className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Current Password</label>
              <Input
                type="password"
                placeholder="Enter current password"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Update Password
            </Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-xl border border-white/10 bg-[#171717] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Bell className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-gray-400">Receive updates via email</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/10 bg-white/5 text-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Push Notifications</p>
                <p className="text-xs text-gray-400">Receive browser notifications</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/10 bg-white/5 text-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Weekly Reports</p>
                <p className="text-xs text-gray-400">Get weekly summary reports</p>
              </div>
              <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="rounded-xl border border-white/10 bg-[#171717] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Database className="h-5 w-5 text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">System</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Language</label>
              <select className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
                <option>English</option>
                <option>Bahasa Indonesia</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Timezone</label>
              <select className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
                <option>Asia/Jakarta (UTC+7)</option>
                <option>Asia/Singapore (UTC+8)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Date Format</label>
              <select className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Clear Cache</p>
              <p className="text-xs text-gray-400">Clear all cached data</p>
            </div>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              Clear Cache
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Reset Settings</p>
              <p className="text-xs text-gray-400">Reset all settings to default</p>
            </div>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
