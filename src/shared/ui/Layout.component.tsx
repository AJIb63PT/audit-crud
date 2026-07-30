import { Link, Outlet } from '@tanstack/react-router';
import { Toast } from './Toast.component';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toast />
      <header className="bg-[#1e3a5f] text-white px-6 py-3 flex items-center gap-6">
        <Link to="/" className="text-white no-underline text-xl font-bold">
          Грузовые аукционы
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="text-blue-300 no-underline">
            Список аукционов
          </Link>
        </nav>
      </header>
      <main className="max-w-[1200px] mx-auto px-4 pt-4 pb-10">
        <Outlet />
      </main>
    </div>
  );
}
