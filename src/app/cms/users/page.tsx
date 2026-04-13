'use client';

/**
 * CMS Users Management
 * List and manage platform users
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Loader2,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Clock,
  DollarSign,
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

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export default function CMSUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter) params.append('status', statusFilter);
        if (roleFilter) params.append('role', roleFilter);
        params.append('limit', pageSize.toString());
        params.append('offset', (currentPage * pageSize).toString());

        const res = await fetch(`/api/cms/users?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data.users || []);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchUsers, searchTerm ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [searchTerm, statusFilter, roleFilter, currentPage]);

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#e8e4df] mb-2">Users</h1>
          <p className="text-sm text-[#666]">
            {pagination ? `${pagination.total} total users` : 'Manage platform users'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59]"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(0);
          }}
          className="px-4 py-2.5 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deleted">Deleted</option>
        </select>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(0);
          }}
          className="px-4 py-2.5 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="premium">Premium</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#4A7C59]" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-[#666]">
            {searchTerm || statusFilter || roleFilter ? 'No users match your filters' : 'No users found'}
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#2a2a3a] text-xs text-[#666] uppercase tracking-wide">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Usage</div>
              <div className="col-span-2">Conversations</div>
              <div className="col-span-2">Joined</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#2a2a3a]">
              {users.map((user) => (
                <Link
                  key={user.user_id}
                  href={`/cms/users/${user.user_id}`}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#2a2a3a]/50 transition-colors"
                >
                  {/* User Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#2a2a3a] flex items-center justify-center">
                        <User size={18} className="text-[#666]" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-[#e8e4df]">
                        {user.full_name || 'No name'}
                      </p>
                      <p className="text-xs text-[#666]">{user.email || 'No email'}</p>
                    </div>
                  </div>

                  {/* Status & Role */}
                  <div className="col-span-2 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    {user.role !== 'user' && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    )}
                  </div>

                  {/* Usage */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-[#e8e4df]">
                      {formatCurrency(user.total_cost_cents)}
                    </span>
                    <span className="text-xs text-[#555] ml-1">
                      / {formatCurrency(user.limit_cents)}
                    </span>
                  </div>

                  {/* Conversations */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-[#e8e4df]">{user.conversation_count}</span>
                  </div>

                  {/* Joined */}
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm text-[#888]">{formatDate(user.created_at)}</span>
                    <ChevronRight size={16} className="text-[#444]" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pageSize && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-[#666]">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] text-[#888] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#3a3a4a] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!pagination.hasMore}
              className="p-2 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] text-[#888] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#3a3a4a] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
