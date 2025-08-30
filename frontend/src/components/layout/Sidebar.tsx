'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  User,
  LogOut,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
    },
    {
      title: 'Courses',
      icon: BookOpen,
      href: '/courses',
      roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
    },
    {
      title: 'Students',
      icon: GraduationCap,
      href: '/students',
      roles: ['ADMIN', 'INSTRUCTOR'],
    },
    {
      title: 'Results',
      icon: ClipboardList,
      href: '/results',
      roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
    },
    {
      title: 'Users',
      icon: Users,
      href: '/users',
      roles: ['ADMIN'],
    },
    {
      title: 'Profile',
      icon: User,
      href: '/profile',
      roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="flex flex-col h-full">
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;