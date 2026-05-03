import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/team', label: 'Team' },
  { to: '/blog', label: 'Blog' },
  { to: '/troubleshooting', label: 'Troubleshooting' },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#fafafa]/80 backdrop-blur-md border-b border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <NavLink to="/" className="text-sm font-bold tracking-tight text-[#111]">
            시골쥐 <span className="text-[#999]">&times;</span> 서울쥐
          </NavLink>
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-[#111] bg-[#f0f0f0]'
                      : 'text-[#888] hover:text-[#111] hover:bg-[#f5f5f5]'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 pt-14">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#aaa]">
            &copy; 2025 Team Cygnus — 시골쥐 &times; 서울쥐
          </p>
          <div className="flex gap-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className="text-xs text-[#aaa] hover:text-[#111] transition-colors">
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
