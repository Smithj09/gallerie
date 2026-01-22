
import React from 'react';
import ProjectGallery from './components/ProjectGallery';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Mock Header for Context */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0D3156] rounded-full flex items-center justify-center text-[#FFC600] font-black italic">
              ED
            </div>
            <div>
              <h1 className="text-[#0D3156] font-black text-sm uppercase leading-none">AD Innovation</h1>
              <p className="text-[#4A6278] text-[9px] font-bold uppercase tracking-tighter">Services Plus</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[#0D3156] font-bold text-[10px] uppercase hover:text-[#FFC600] transition-colors tracking-widest">Services</a>
            <a href="#" className="text-[#0D3156] font-bold text-[10px] uppercase hover:text-[#FFC600] transition-colors tracking-widest border-b-2 border-[#FFC600]">Réalisations</a>
            <a href="#" className="text-[#0D3156] font-bold text-[10px] uppercase hover:text-[#FFC600] transition-colors tracking-widest">À Propos</a>
          </nav>

          <button className="bg-[#0D3156] text-white px-5 py-2.5 rounded text-[10px] font-extrabold uppercase tracking-widest hover:bg-slate-800 transition-colors">
            Contactez-nous
          </button>
        </div>
      </header>

      {/* Hero Mini Section */}
      <div className="bg-[#0D3156] py-12 px-6 text-center">
        <h2 className="text-white text-3xl md:text-5xl font-black uppercase mb-4 tracking-tight">
          Portfolio de nos <span className="text-[#FFC600]">Solutions</span>
        </h2>
        <p className="text-slate-400 text-xs md:text-sm uppercase tracking-[0.3em] max-w-2xl mx-auto font-medium">
          Installation, entretien et performance solaire à travers tout le territoire.
        </p>
      </div>

      <main>
        <ProjectGallery />
      </main>

      {/* Mock Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#0D3156] rounded-full flex items-center justify-center text-[#FFC600] font-black italic text-xl">
              ED
            </div>
            <div className="text-left">
              <h1 className="text-[#0D3156] font-black text-lg uppercase leading-none">AD Innovation</h1>
              <p className="text-[#4A6278] text-xs font-bold uppercase tracking-tighter">Engineering Excellence</p>
            </div>
          </div>
          
          <p className="text-[#4A6278] text-[10px] font-bold uppercase tracking-[0.4em] opacity-50 text-center">
            &copy; {new Date().getFullYear()} AD Innovation Services Plus. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
