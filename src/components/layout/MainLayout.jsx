import Sidebar from '../Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto transition-all">
        <div className="p-8 max-w-7xl mx-auto w-full animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
}