import TopNav from '../components/TopNav.jsx';

function DashboardLayout({ children, onGuide, onVault, onHistory }) {
  return (
    <div className="relative min-h-[100dvh] bg-[#050505] text-white selection:bg-[#2D7DFF]/30 overflow-x-hidden flex flex-col">
      
      {/* Atmospheric Background - Very subtle for premium feel */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-[radial-gradient(ellipse_at_top,rgba(45,125,255,0.08),transparent_70%)] opacity-70" />
        <div className="absolute inset-0 bg-[#050505] opacity-50" />
      </div>

      {/* Navigation */}
      <div className="relative z-50">
        <TopNav onGuide={onGuide} onVault={onVault} onHistory={onHistory} />
      </div>

      {/* Main Content Layout Engine */}
      <main className="relative z-10 flex-1 w-full mx-auto max-w-7xl px-4 pt-24 pb-32 sm:px-6 md:pt-28 md:pb-40 lg:px-12 flex flex-col min-h-0 isolate">
        <div className="w-full flex-1 flex flex-col max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;