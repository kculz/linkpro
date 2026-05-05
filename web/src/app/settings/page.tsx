'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  User, Shield, Bell, Palette, Key, Save, Loader2, CheckCircle2,
  AlertCircle, Mail, Phone, Camera, Lock, Eye, EyeOff, LogOut, Moon, Sun
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/services/api';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

type Tab = 'profile' | 'security' | 'notifications' | 'appearance';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile state
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '', avatar: '' });
  const [profileLoading, setProfileLoading] = useState(true);

  // Security state
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Notification prefs (local only)
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifs: true, pushNotifs: true, maintenanceAlerts: true,
    paymentReminders: true, projectUpdates: true, tenantMessages: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => { setSuccess(''); setError(''); }, 4000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const u = data.data;
      setProfile({ name: u.name, email: u.email, phone: u.phone || '', role: u.role, avatar: u.avatar || '' });
    } catch { }
    setProfileLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true); setError('');
    try {
      await api.put('/auth/profile', { name: profile.name, phone: profile.phone });
      setSuccess('Profile updated successfully.');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update profile.');
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match.'); return;
    }
    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters.'); return;
    }
    setSaving(true); setError('');
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setSuccess('Password changed successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to change password.');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-status-error/20 text-status-error border-status-error/30',
      PM: 'bg-primary/20 text-primary border-primary/30',
      CLIENT: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
      TENANT: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    };
    return colors[role] || 'bg-white/10 text-white/40 border-white/10';
  };

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const InputField = ({ label, icon: Icon, value, onChange, type = 'text', disabled = false, placeholder = '', rightIcon }: any) => (
    <div>
      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-2 block">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            "w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3.5 pl-12 pr-12 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all",
            disabled && "opacity-30 cursor-not-allowed"
          )}
        />
        {rightIcon}
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.02] last:border-0">
      <span className="text-xs font-bold text-white/60 italic">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={clsx(
          "w-11 h-6 rounded-full transition-all duration-300 relative",
          checked ? "bg-primary shadow-[0_0_15px_rgba(59,130,246,0.4)]" : "bg-white/[0.06]"
        )}
      >
        <div className={clsx(
          "w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300",
          checked ? "left-6" : "left-1"
        )} />
      </button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Settings & Configuration</h1>
          <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Profile • Security • Preferences</p>
        </div>

        {/* Toast */}
        {(success || error) && (
          <div className={clsx(
            "flex items-center gap-3 px-6 py-4 rounded-2xl border animate-in slide-in-from-top-2 duration-300",
            success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-status-error/10 border-status-error/20 text-status-error"
          )}>
            {success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="text-xs font-bold italic">{success || error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-surface/30 border border-white/[0.03] rounded-[2.5rem] p-4 backdrop-blur-md space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group text-left",
                    activeTab === tab.id
                      ? "bg-primary/[0.05] text-white border border-primary/10"
                      : "text-white/30 hover:bg-white/[0.02] hover:text-white"
                  )}
                >
                  <tab.icon className={clsx("w-5 h-5 transition-all", activeTab === tab.id ? "text-primary" : "text-white/15 group-hover:text-primary")} />
                  <span className="text-xs font-black italic uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-white/[0.03]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-white/20 hover:bg-status-error/5 hover:text-status-error transition-all duration-300 group text-left"
                >
                  <LogOut className="w-5 h-5 text-white/10 group-hover:text-status-error transition-all" />
                  <span className="text-xs font-black italic uppercase tracking-widest">Logout System</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Profile Card */}
                <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-8 px-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Profile Information</h3>
                  </div>

                  {/* Avatar + Name Header */}
                  <div className="flex items-center gap-6 mb-10 p-6 bg-white/[0.01] rounded-[2rem] border border-white/[0.03]">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-white/20 overflow-hidden">
                        {profile.avatar ? (
                          <img src={profile.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-2xl font-black italic">{getInitials(profile.name || 'U')}</span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-[1.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                        <Camera className="w-6 h-6 text-white/60" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-black text-white italic uppercase tracking-tighter">{profile.name || 'Loading...'}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={clsx("px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest italic border", getRoleBadge(profile.role))}>
                          {profile.role}
                        </span>
                        <span className="text-[9px] text-white/10 font-bold italic lowercase">{profile.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name" icon={User} value={profile.name} onChange={(v: string) => setProfile(p => ({ ...p, name: v }))} placeholder="Your full name" />
                    <InputField label="Email Address" icon={Mail} value={profile.email} onChange={() => {}} disabled placeholder="Email cannot be changed" />
                    <InputField label="Phone Number" icon={Phone} value={profile.phone} onChange={(v: string) => setProfile(p => ({ ...p, phone: v }))} placeholder="+263 7X XXX XXXX" />
                    <InputField label="Account Role" icon={Shield} value={profile.role} onChange={() => {}} disabled placeholder="Role" />
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20 disabled:opacity-40"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-8 px-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Change Password</h3>
                  </div>

                  <div className="space-y-6 max-w-md">
                    <InputField
                      label="Current Password" icon={Lock} type={showCurrent ? 'text' : 'password'}
                      value={passwords.currentPassword}
                      onChange={(v: string) => setPasswords(p => ({ ...p, currentPassword: v }))}
                      placeholder="Enter current password"
                      rightIcon={
                        <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 hover:text-white/30 transition-colors">
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                    <InputField
                      label="New Password" icon={Key} type={showNew ? 'text' : 'password'}
                      value={passwords.newPassword}
                      onChange={(v: string) => setPasswords(p => ({ ...p, newPassword: v }))}
                      placeholder="Enter new password"
                      rightIcon={
                        <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 hover:text-white/30 transition-colors">
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                    <InputField
                      label="Confirm New Password" icon={Key} type="password"
                      value={passwords.confirmPassword}
                      onChange={(v: string) => setPasswords(p => ({ ...p, confirmPassword: v }))}
                      placeholder="Re-enter new password"
                    />
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleChangePassword}
                      disabled={saving || !passwords.currentPassword || !passwords.newPassword}
                      className="px-8 py-4 bg-amber-500 text-black rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center gap-3 border border-amber-500/20 disabled:opacity-40"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Sessions */}
                <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-6 px-2">
                    <div className="w-2 h-2 rounded-full bg-status-error shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Danger Zone</h3>
                  </div>
                  <div className="p-6 bg-status-error/[0.03] border border-status-error/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-white italic uppercase tracking-tighter">Sign Out Everywhere</p>
                      <p className="text-[9px] text-white/20 font-bold italic mt-1">End all active sessions on all devices</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-status-error/10 border border-status-error/20 text-status-error rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-status-error/20 transition-all"
                    >
                      Sign Out All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-8 px-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Notification Preferences</h3>
                  </div>

                  <div className="space-y-1 max-w-lg">
                    <Toggle label="Email Notifications" checked={notifPrefs.emailNotifs} onChange={v => setNotifPrefs(p => ({ ...p, emailNotifs: v }))} />
                    <Toggle label="Push Notifications" checked={notifPrefs.pushNotifs} onChange={v => setNotifPrefs(p => ({ ...p, pushNotifs: v }))} />
                    <Toggle label="Maintenance Alerts" checked={notifPrefs.maintenanceAlerts} onChange={v => setNotifPrefs(p => ({ ...p, maintenanceAlerts: v }))} />
                    <Toggle label="Payment Reminders" checked={notifPrefs.paymentReminders} onChange={v => setNotifPrefs(p => ({ ...p, paymentReminders: v }))} />
                    <Toggle label="Project Updates" checked={notifPrefs.projectUpdates} onChange={v => setNotifPrefs(p => ({ ...p, projectUpdates: v }))} />
                    <Toggle label="Tenant Messages" checked={notifPrefs.tenantMessages} onChange={v => setNotifPrefs(p => ({ ...p, tenantMessages: v }))} />
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-8 px-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Theme & Appearance</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
                    <button className="p-6 bg-primary/[0.05] border-2 border-primary/30 rounded-[2rem] transition-all text-left group">
                      <div className="w-12 h-12 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center mb-4">
                        <Moon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-xs font-black text-white italic uppercase tracking-tighter">Dark Mode</p>
                      <p className="text-[9px] text-white/20 font-bold italic mt-1">Current theme</p>
                    </button>
                    <button className="p-6 bg-white/[0.02] border-2 border-white/[0.05] rounded-[2rem] transition-all text-left group hover:border-white/10 opacity-40">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
                        <Sun className="w-6 h-6 text-amber-500" />
                      </div>
                      <p className="text-xs font-black text-white italic uppercase tracking-tighter">Light Mode</p>
                      <p className="text-[9px] text-white/20 font-bold italic mt-1">Coming soon</p>
                    </button>
                  </div>
                </div>

                {/* App Info */}
                <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-6 px-2">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">System Information</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[
                      { label: 'Version', value: 'v1.0.0' },
                      { label: 'Platform', value: 'Web' },
                      { label: 'API', value: '/api/v1' },
                      { label: 'Engine', value: 'Next.js' },
                    ].map(info => (
                      <div key={info.label}>
                        <p className="text-[9px] font-black text-white/10 uppercase tracking-widest italic mb-1">{info.label}</p>
                        <p className="text-xs font-black text-white italic uppercase tracking-tighter">{info.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
