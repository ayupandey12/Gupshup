'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../lib/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const navLinks = user ? [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: `/dashboard/${user.username}` },
  ] : [
    { name: 'Home', href: '/' },
    { name: 'Sign In', href: '/signin' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-[#f6efe4]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="inline-flex items-center gap-3 text-lg font-black tracking-tight text-slate-950">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-[#fde7c8] text-slate-900 shadow-sm">
            G
          </span>
          Gupshup
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="transition hover:text-slate-950">
              {link.name}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} className="transition hover:text-slate-950">
              Logout
            </button>
          )}
        </div>

        <button
          className="md:hidden rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} border-t border-slate-200 bg-[#f6efe4]`}>
        <div className="space-y-2 px-6 py-5 text-slate-700">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="block rounded-3xl px-4 py-3 transition hover:bg-slate-100">
              {link.name}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} className="block w-full rounded-3xl px-4 py-3 text-left transition hover:bg-slate-100">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
