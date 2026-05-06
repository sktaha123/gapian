import TopNav from '../components/TopNav.jsx';

function DashboardLayout({ children, onGuide }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070B] text-[#F8FAFC]">
      
      {/* Atmospheric Background */}
      <div className="pointer-events-none absolute inset-0">
        
        {/* Top Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_40%)]" />

        {/* Bottom Ambient Light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.05),transparent_35%)]" />

        {/* Soft Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      {/* Navigation */}
      <TopNav onGuide={onGuide} />

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pt-28 pb-40 sm:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;