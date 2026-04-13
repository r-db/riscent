'use client';

/**
 * CMS Layout
 * Admin dashboard layout with sidebar navigation
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser, SignOutButton, UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  BookOpen,
  FolderOpen,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/cms',
    icon: LayoutDashboard,
  },
  {
    label: 'Research',
    href: '/cms/research',
    icon: BookOpen,
    children: [
      { label: 'Topics', href: '/cms/research/topics' },
      { label: 'Articles', href: '/cms/research/articles' },
      { label: 'Documents', href: '/cms/research/documents' },
    ],
  },
  {
    label: 'Users',
    href: '/cms/users',
    icon: Users,
  },
  {
    label: 'Analytics',
    href: '/cms/analytics',
    icon: BarChart3,
  },
];

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4A7C59] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a24] border-r border-[#2a2a3a] flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#2a2a3a]">
          <Link href="/cms" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4A7C59]/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#4A7C59]" />
            </div>
            <span className="text-lg font-semibold text-[#e8e4df]">Riscent CMS</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#4A7C59]/20 text-[#4A7C59]'
                      : 'text-[#888] hover:text-[#e8e4df] hover:bg-[#2a2a3a]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.children && (
                    <ChevronRight
                      size={14}
                      className={`ml-auto transition-transform ${isActive ? 'rotate-90' : ''}`}
                    />
                  )}
                </Link>

                {/* Children */}
                {item.children && isActive && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            childActive
                              ? 'text-[#4A7C59] bg-[#4A7C59]/10'
                              : 'text-[#666] hover:text-[#e8e4df] hover:bg-[#2a2a3a]'
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* View Site Link */}
        <div className="px-3 py-2 border-t border-[#2a2a3a]">
          <a
            href="https://riscent.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#666] hover:text-[#e8e4df] hover:bg-[#2a2a3a] transition-colors"
          >
            <ExternalLink size={18} />
            <span>View Site</span>
          </a>
        </div>

        {/* User */}
        <div className="p-4 border-t border-[#2a2a3a]">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#e8e4df] truncate">
                {user?.fullName || user?.emailAddresses?.[0]?.emailAddress}
              </p>
              <p className="text-xs text-[#666] truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
