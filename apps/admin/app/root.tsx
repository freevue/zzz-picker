import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, NavLink } from '@remix-run/react'
import { Toaster } from 'sonner'
import '~/index.css'
import { cn } from '~/lib/utils'

export const meta: MetaFunction = () => {
  return [
    { title: 'ZZZ Picker Admin' },
    { name: 'description', content: 'Admin dashboard for ZZZ Picker' },
  ]
}

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ]
}

const SidebarItem = ({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-charade-800',
        isActive ? 'bg-charade-800 text-white shadow-sm' : 'text-charade-400'
      )
    }
  >
    <div className="flex-shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
    <span>{label}</span>
  </NavLink>
)

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen font-sans bg-charade-950 text-charade-200">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-charade-800 bg-charade-900/50 backdrop-blur-xl transition-all sm:static sm:block hidden">
            <div className="flex h-16 items-center px-6 border-b border-charade-800">
              <span className="text-xl font-bold text-white tracking-tight">
                ZZZ Picker <span className="text-primary">Admin</span>
              </span>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              <SidebarItem
                to="/"
                label="이미지 관리"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
              <div className="mt-4 px-3 mb-2">
                <span className="text-[10px] font-bold text-charade-500 uppercase tracking-widest">
                  More Features
                </span>
              </div>
              <SidebarItem
                to="/dashboard"
                label="대시보드"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
              />
              <SidebarItem
                to="/settings"
                label="환경 설정"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t border-charade-800">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/20">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Administrator</span>
                  <span className="text-[10px] text-charade-500">
                    v{typeof __VERSION__ !== 'undefined' ? __VERSION__ : '0.1.0'}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex flex-1 flex-col">
            <header className="h-16 border-b border-charade-800 bg-charade-900/30 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-charade-400">
                Current View: <span className="text-white">Image Management</span>
              </h2>
              <div className="flex items-center gap-4">
                <button className="text-charade-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
              </div>
            </header>
            <main className="flex-1 p-6 sm:p-10">{children}</main>
          </div>
        </div>
        <Toaster position="top-right" richColors theme="dark" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charade-950">
      <div className="text-center p-8 bg-charade-900 rounded-2xl border border-charade-800 shadow-2xl">
        <h1 className="text-3xl font-bold text-red-500 mb-4">CRITICAL ERROR</h1>
        <p className="text-charade-300 mb-6 max-w-sm">
          Something went wrong in the admin dashboard. Please refresh or contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-charade-800 hover:bg-charade-700 text-white rounded-lg transition-colors border border-charade-700"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
