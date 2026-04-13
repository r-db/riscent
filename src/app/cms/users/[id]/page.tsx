'use client';

/**
 * CMS - User Detail Page
 * View and manage individual user
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  ArrowLeft,
  Loader2,
  Shield,
  Ban,
  RefreshCw,
  ChevronRight,
  Activity,
  Zap,
  Hash,
} from 'lucide-react';

interface UserData {
  user_id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  total_cost_cents: number;
  limit_cents: number;
  conversation_count: number;
  total_input_tokens: number;
  total_output_tokens: number;
  created_at: string;
  last_active_at: string | null;
}

interface Conversation {
  conversation_id: string;
  title: string | null;
  message_count: number;
  total_cost_cents: number;
  created_at: string;
  last_message_at: string | null;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/cms/users/${userId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('User not found');
            return;
          }
          throw new Error('Failed to fetch user');
        }
        const data = await res.json();
        setUser(data.user);
        setConversations(data.conversations || []);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const formatNumber = (num: number) => num.toLocaleString();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-[#4A7C59] bg-[#4A7C59]/10';
      case 'suspended':
        return 'text-[#E07A5F] bg-[#E07A5F]/10';
      case 'deleted':
        return 'text-[#666] bg-[#666]/10';
      default:
        return 'text-[#666] bg-[#666]/10';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-[#D4A84B] bg-[#D4A84B]/10';
      case 'premium':
        return 'text-[#2C5282] bg-[#2C5282]/10';
      default:
        return 'text-[#666] bg-[#666]/10';
    }
  };

  const updateUserStatus = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} this user?`)) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/cms/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user status');
    } finally {
      setSaving(false);
    }
  };

  const updateUserRole = async (newRole: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user role');
    } finally {
      setSaving(false);
    }
  };

  const updateUserLimit = async (newLimitCents: number) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit_cents: newLimitCents }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user limit');
    } finally {
      setSaving(false);
    }
  };

  const resetUserUsage = async () => {
    if (!confirm('Are you sure you want to reset this user\'s usage? This cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/cms/users/${userId}/reset`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to reset usage');
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Error resetting usage:', err);
      alert('Failed to reset user usage');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E07A5F] mb-4">{error || 'User not found'}</p>
          <Link
            href="/cms/users"
            className="px-4 py-2 bg-[#4A7C59] text-white rounded-lg text-sm"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const usagePercentage = Math.min((user.total_cost_cents / user.limit_cents) * 100, 100);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/cms/users"
        className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#888] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Users
      </Link>

      {/* Header */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#2a2a3a] flex items-center justify-center">
              <User size={32} className="text-[#666]" />
            </div>
          )}

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-light text-[#e8e4df]">
                {user.full_name || 'No name'}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
              {user.role !== 'user' && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              )}
            </div>

            {user.email && (
              <div className="flex items-center gap-2 text-sm text-[#888] mb-4">
                <Mail size={14} />
                {user.email}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#666]">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                Joined {formatDate(user.created_at)}
              </div>
              {user.last_active_at && (
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  Last active {formatDateTime(user.last_active_at)}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Hash size={14} />
                <span className="font-mono text-xs">{user.clerk_user_id}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {user.status === 'active' ? (
              <button
                onClick={() => updateUserStatus('suspended')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#E07A5F]/10 text-[#E07A5F] rounded-lg text-sm font-medium hover:bg-[#E07A5F]/20 transition-colors disabled:opacity-50"
              >
                <Ban size={16} />
                Suspend
              </button>
            ) : (
              <button
                onClick={() => updateUserStatus('active')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59]/10 text-[#4A7C59] rounded-lg text-sm font-medium hover:bg-[#4A7C59]/20 transition-colors disabled:opacity-50"
              >
                <Shield size={16} />
                Activate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Usage */}
        <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-5">
          <div className="flex items-center gap-2 text-sm text-[#666] mb-3">
            <DollarSign size={16} />
            Usage
          </div>
          <div className="text-2xl font-light text-[#e8e4df] mb-2">
            {formatCurrency(user.total_cost_cents)}
          </div>
          <div className="mb-2">
            <div className="h-1.5 bg-[#2a2a3a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4A7C59] rounded-full transition-all"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-[#666]">
            of {formatCurrency(user.limit_cents)} limit
          </p>
        </div>

        {/* Conversations */}
        <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-5">
          <div className="flex items-center gap-2 text-sm text-[#666] mb-3">
            <MessageSquare size={16} />
            Conversations
          </div>
          <div className="text-2xl font-light text-[#e8e4df]">
            {formatNumber(user.conversation_count)}
          </div>
        </div>

        {/* Input Tokens */}
        <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-5">
          <div className="flex items-center gap-2 text-sm text-[#666] mb-3">
            <Zap size={16} />
            Input Tokens
          </div>
          <div className="text-2xl font-light text-[#e8e4df]">
            {formatNumber(user.total_input_tokens)}
          </div>
        </div>

        {/* Output Tokens */}
        <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-5">
          <div className="flex items-center gap-2 text-sm text-[#666] mb-3">
            <Activity size={16} />
            Output Tokens
          </div>
          <div className="text-2xl font-light text-[#e8e4df]">
            {formatNumber(user.total_output_tokens)}
          </div>
        </div>
      </div>

      {/* Settings & Conversations */}
      <div className="grid grid-cols-3 gap-6">
        {/* Settings */}
        <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-6">
          <h2 className="text-lg font-light text-[#e8e4df] mb-6">Settings</h2>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm text-[#666] mb-2">Role</label>
            <select
              value={user.role}
              onChange={(e) => updateUserRole(e.target.value)}
              disabled={saving}
              className="w-full px-4 py-2.5 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59] disabled:opacity-50"
            >
              <option value="user">User</option>
              <option value="premium">Premium</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Limit */}
          <div className="mb-6">
            <label className="block text-sm text-[#666] mb-2">Usage Limit</label>
            <select
              value={user.limit_cents}
              onChange={(e) => updateUserLimit(parseInt(e.target.value, 10))}
              disabled={saving}
              className="w-full px-4 py-2.5 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59] disabled:opacity-50"
            >
              <option value="100">$1.00</option>
              <option value="200">$2.00</option>
              <option value="500">$5.00</option>
              <option value="1000">$10.00</option>
              <option value="2500">$25.00</option>
              <option value="5000">$50.00</option>
              <option value="10000">$100.00</option>
            </select>
          </div>

          {/* Reset Usage */}
          <button
            onClick={resetUserUsage}
            disabled={saving}
            className="flex items-center gap-2 w-full px-4 py-2.5 bg-[#2a2a3a] text-[#888] rounded-lg text-sm font-medium hover:bg-[#3a3a4a] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Reset Usage
          </button>
        </div>

        {/* Recent Conversations */}
        <div className="col-span-2 bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-6">
          <h2 className="text-lg font-light text-[#e8e4df] mb-4">Recent Conversations</h2>

          {conversations.length === 0 ? (
            <div className="text-center text-[#666] py-8">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.slice(0, 10).map((conv) => (
                <div
                  key={conv.conversation_id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2a2a3a]/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#e8e4df] truncate">
                      {conv.title || 'Untitled conversation'}
                    </p>
                    <p className="text-xs text-[#666]">
                      {conv.message_count} messages • {formatCurrency(conv.total_cost_cents)}
                    </p>
                  </div>
                  <div className="text-xs text-[#555] ml-4">
                    {formatDateTime(conv.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
